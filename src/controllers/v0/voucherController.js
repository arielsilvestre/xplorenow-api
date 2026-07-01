const { Reservation, Activity, Destination, TourGuide, Image } = require('../../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'meetingPoint', 'guideId'],
  include: [
    { model: Destination, as: 'destination', attributes: ['id', 'name'], required: false },
    { model: TourGuide, as: 'guide', attributes: ['id', 'name'], required: false },
    { model: Image, as: 'images', attributes: ['id', 'url'], required: false },
  ],
};

const deriveState = (plain) => {
  const today = new Date().toISOString().split('T')[0];
  if (plain.status === 'cancelled') return 'CANCELLED';
  if (plain.status === 'pending')   return 'PENDING';
  if (plain.status === 'confirmed' && String(plain.date) < today) return 'COMPLETED';
  return 'CONFIRMED';
};

const getVoucher = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [activityInclude],
    });
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

    const plain = reservation.toJSON();
    const activity = plain.activity || {};
    const guide = activity.guide || {};
    const dest = activity.destination || {};

    res.json({
      reserveId: plain.id,
      voucherCode: plain.voucherCode ?? null,
      activityTitle: activity.name ?? null,
      reservationDate: plain.date,
      meetingPoint: activity.meetingPoint ?? null,
      guideName: guide.name ?? null,
      numberOfPeople: plain.people,
      state: deriveState(plain),
      checkedIn: plain.checkedIn ?? false,
      checkedInAt: plain.checkedInAt ?? null,
    });
  } catch (err) {
    console.error('Error fetching voucher:', err);
    res.status(500).json({ message: 'Error al obtener voucher' });
  }
};

const checkIn = async (req, res) => {
  try {
    const { qrPayload } = req.body;
    if (!qrPayload) return res.status(400).json({ message: 'qrPayload es requerido' });

    const reservation = await Reservation.findOne({ where: { voucherCode: qrPayload } });
    if (!reservation) return res.status(404).json({ message: 'Voucher no encontrado' });

    if (reservation.checkedIn) {
      return res.status(409).json({ message: 'Ya se realizó el check-in para esta reserva', reserveId: reservation.id });
    }

    await reservation.update({ checkedIn: true, checkedInAt: new Date() });
    res.json({ success: true, message: 'Check-in exitoso', reserveId: reservation.id });
  } catch (err) {
    console.error('Error en check-in:', err);
    res.status(500).json({ message: 'Error al procesar check-in' });
  }
};

module.exports = { getVoucher, checkIn };
