const { Reservation, Activity, Destination } = require('../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'description', 'price', 'capacity', 'imageUrl', 'category'],
  include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [activityInclude],
      order: [['date', 'DESC']],
    });
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ success: false, message: 'Error al obtener reservas' });
  }
};

const create = async (req, res) => {
  try {
    const { activityId, date, people } = req.body;

    if (!activityId || !date || !people) {
      return res.status(400).json({ success: false, message: 'activityId, date y people son requeridos' });
    }

    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    const reservation = await Reservation.create({
      activityId,
      userId: req.user.id,
      date,
      people,
      status: 'pending',
    });

    const result = await Reservation.findByPk(reservation.id, {
      include: [activityInclude],
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Error al crear reserva' });
  }
};

module.exports = { getMyReservations, create };
