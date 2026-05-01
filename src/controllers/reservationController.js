const { Op } = require('sequelize');
const { Reservation, Activity, Destination } = require('../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'description', 'price', 'capacity', 'imageUrl', 'category', 'meetingPoint', 'duration'],
  include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id, status: { [Op.in]: ['pending', 'confirmed'] } },
      include: [activityInclude],
      order: [['date', 'DESC']],
    });
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ success: false, message: 'Error al obtener reservas' });
  }
};

const getHistory = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const reservations = await Reservation.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { status: 'cancelled' },
          { status: 'confirmed', date: { [Op.lt]: today } },
        ],
      },
      include: [activityInclude],
      order: [['date', 'DESC']],
    });
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Error al obtener historial' });
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
      activityId, userId: req.user.id, date, people, status: 'pending',
    });
    const result = await Reservation.findByPk(reservation.id, { include: [activityInclude] });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Error al crear reserva' });
  }
};

const cancel = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    }
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'La reserva ya está cancelada' });
    }
    await reservation.update({ status: 'cancelled' });
    res.json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ success: false, message: 'Error al cancelar reserva' });
  }
};

module.exports = { getMyReservations, getHistory, create, cancel };
