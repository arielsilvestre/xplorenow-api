const { Op } = require('sequelize');
const { Reservation, Activity, Destination, TourGuide, Review, Image, User } = require('../../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'price', 'imageUrl', 'photos', 'duration', 'meetingPoint', 'cancellationPolicy', 'language', 'destinationId', 'guideId'],
  include: [
    { model: Destination, as: 'destination', attributes: ['id', 'name', 'country'], required: false },
    { model: TourGuide, as: 'guide', attributes: ['id', 'name'], required: false },
    { model: Image, as: 'images', attributes: ['id', 'url'], required: false },
  ],
};

const toDto = async (reservation, userId) => {
  const plain = reservation.toJSON ? reservation.toJSON() : reservation;
  const activity = plain.activity || {};
  const dest = activity.destination || {};
  const guide = activity.guide || {};
  const images = (activity.images || []).map(img => ({ id_image: img.id, url: img.url }));
  if (images.length === 0 && activity.imageUrl) {
    images.push({ id_image: null, url: activity.imageUrl });
  }

  // Derivar estado en uppercase para Android (que compara con "PENDING","CONFIRMED","CANCELLED","COMPLETED")
  // COMPLETED = confirmed + fecha pasada (no existe en DB, se deriva)
  const today = new Date().toISOString().split('T')[0];
  const derivedState =
    plain.status === 'cancelled' ? 'CANCELLED' :
    plain.status === 'pending'   ? 'PENDING' :
    plain.status === 'confirmed' && String(plain.date) < today ? 'COMPLETED' :
    'CONFIRMED';
  const canRate = derivedState === 'COMPLETED';

  // Verificar si ya calificó
  let alreadyRated = false;
  let myActivityRating = null;
  let myGuideRating = null;
  let myComment = null;

  if (canRate && activity.id) {
    const review = await Review.findOne({ where: { userId, activityId: activity.id } });
    if (review) {
      alreadyRated = true;
      myActivityRating = review.stars;
      myGuideRating = review.guideRating;
      myComment = review.comment;
    }
  }

  const totalPrice = plain.totalPrice
    ? parseFloat(plain.totalPrice)
    : (activity.price || 0) * (plain.people || 1);

  return {
    id_reserve: plain.id,
    creation_date: plain.createdAt,
    number_of_people: plain.people,
    totalPrice,
    state: derivedState,
    travellerName: plain.user ? plain.user.name : null,
    travellerId: plain.userId,
    disponibilityId: plain.disponibilityId ?? null,
    disponibilityPrice: activity.price ?? null,
    activityTitle: activity.name ?? null,
    reservationDate: plain.date,
    activityId: activity.id ?? null,
    activityImages: images,
    canRate,
    alreadyRated,
    myActivityRating,
    myGuideRating,
    myComment,
    guideName: guide.name ?? null,
    city: dest.name ?? null,
    duration: activity.duration ?? null,
    meetingPoint: activity.meetingPoint ?? null,
    country: dest.country ?? null,
  };
};

const getHistory = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        activityInclude,
        { model: User, as: 'user', attributes: ['id', 'name'], required: false },
      ],
      order: [['date', 'DESC']],
    });
    const dtos = await Promise.all(reservations.map(r => toDto(r, req.user.id)));
    res.json(dtos);
  } catch (err) {
    console.error('Error fetching reserve history:', err);
    res.status(500).json({ message: 'Error al obtener historial de reservas' });
  }
};

const create = async (req, res) => {
  try {
    const { disponibility } = req.body;
    // Android envía number_of_people (snake_case via @SerializedName); aceptar ambas formas
    const people = req.body.number_of_people ?? req.body.numberOfPeople ?? req.body.people ?? 1;
    // Android envía disponibility.id_disponibility (snake_case via @SerializedName); aceptar ambas formas
    const disponibilityId = disponibility?.id_disponibility ?? disponibility?.idDisponibility ?? req.body.disponibilityId;
    const activityId = req.body.activityId ?? disponibility?.activityId;
    const date = req.body.reservationDate ?? req.body.date;

    if (!activityId || !date) {
      return res.status(400).json({ message: 'activityId y date son requeridos' });
    }

    const activity = await Activity.findByPk(activityId);
    if (!activity) return res.status(404).json({ message: 'Actividad no encontrada' });

    const reserved = await Reservation.sum('people', {
      where: { activityId, status: { [Op.in]: ['pending', 'confirmed'] } },
    }) || 0;
    if (reserved + people > activity.capacity) {
      return res.status(400).json({ message: 'No hay suficientes cupos disponibles' });
    }

    const totalPrice = parseFloat(activity.price) * people;
    const reservation = await Reservation.create({
      activityId,
      userId: req.user.id,
      date,
      people,
      status: 'pending',
      totalPrice,
      disponibilityId: disponibilityId ?? null,
    });

    // Generar voucherCode único después del insert (necesita el ID)
    const voucherCode = 'VCH' + reservation.id.toString().padStart(6, '0');
    await reservation.update({ voucherCode });

    const result = await Reservation.findByPk(reservation.id, {
      include: [activityInclude, { model: User, as: 'user', attributes: ['id', 'name'], required: false }],
    });
    const dto = await toDto(result, req.user.id);
    res.status(201).json(dto);
  } catch (err) {
    console.error('Error creating reserve:', err);
    res.status(500).json({ message: 'Error al crear reserva' });
  }
};

const cancel = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'La reserva ya está cancelada' });
    }
    await reservation.update({ status: 'cancelled' });
    res.json({ message: 'Reserva cancelada', idReserve: reservation.id });
  } catch (err) {
    console.error('Error cancelling reserve:', err);
    res.status(500).json({ message: 'Error al cancelar reserva' });
  }
};

module.exports = { getHistory, create, cancel };
