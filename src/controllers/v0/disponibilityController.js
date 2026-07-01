const { Availability, TourGuide, Reservation, Activity } = require('../../models');
const { Op, literal } = require('sequelize');

const toDto = (avail) => {
  const reserved = avail.get('reservedCount') || 0;
  const total = avail.totalQuota ?? avail.spotsLeft;
  return {
    id_disponibility: avail.id,
    hour: avail.hour,
    precio: avail.precio ?? null,
    total_quota: total,
    disponible_quota: Math.max(0, total - reserved),
    activityId: avail.activityId,
    guideId: avail.guideId ?? null,
    date: avail.date,
  };
};

const guideInclude = {
  model: TourGuide,
  as: 'guide',
  attributes: ['id', 'name'],
  required: false,
};

const reservedCountLiteral = literal(`(
  SELECT COALESCE(SUM(r.people), 0)
  FROM "Reservations" r
  WHERE r."activityId" = "Availability"."activityId"
  AND r.status IN ('pending', 'confirmed')
)`);

const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.activityId) where.activityId = req.query.activityId;
    if (req.query.date) where.date = req.query.date;

    const availabilities = await Availability.findAll({
      where,
      attributes: { include: [[reservedCountLiteral, 'reservedCount']] },
      include: [guideInclude],
      order: [['date', 'ASC'], ['hour', 'ASC']],
    });
    res.json(availabilities.map(toDto));
  } catch (err) {
    console.error('Error fetching disponibilities:', err);
    res.status(500).json({ message: 'Error al obtener disponibilidades' });
  }
};

const getById = async (req, res) => {
  try {
    const avail = await Availability.findByPk(req.params.id, {
      attributes: { include: [[reservedCountLiteral, 'reservedCount']] },
      include: [guideInclude],
    });
    if (!avail) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json(toDto(avail));
  } catch (err) {
    console.error('Error fetching disponibility:', err);
    res.status(500).json({ message: 'Error al obtener disponibilidad' });
  }
};

module.exports = { getAll, getById };
