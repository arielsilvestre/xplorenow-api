const { Op, literal } = require('sequelize');
const { Activity, Destination, TourGuide } = require('../models');

const availableSpotsLiteral = literal(`(
  "Activity"."capacity" - COALESCE((
    SELECT SUM(r.people)
    FROM "Reservations" r
    WHERE r."activityId" = "Activity"."id"
    AND r.status IN ('pending', 'confirmed')
  ), 0)
)`);

const buildWhere = (query) => {
  const where = {};
  if (query.category) where.category = query.category;
  if (query.categories) where.category = { [Op.in]: query.categories.split(',') };
  if (query.destinationId) where.destinationId = query.destinationId;
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price[Op.gte] = parseFloat(query.minPrice);
    if (query.maxPrice) where.price[Op.lte] = parseFloat(query.maxPrice);
  }
  return where;
};

const guideInclude = {
  model: TourGuide,
  as: 'guide',
  attributes: ['id', 'name', 'bio', 'photoUrl', 'rating'],
};

const getAll = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: buildWhere(req.query),
      attributes: { include: [[availableSpotsLiteral, 'availableSpots']] },
      include: [
        { model: Destination, as: 'destination', attributes: ['id', 'name'] },
        guideInclude,
      ],
      order: [['name', 'ASC']],
    });
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, message: 'Error al obtener actividades' });
  }
};

const getById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      attributes: { include: [[availableSpotsLiteral, 'availableSpots']] },
      include: [
        { model: Destination, as: 'destination', attributes: ['id', 'name'] },
        guideInclude,
      ],
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ success: false, message: 'Error al obtener actividad' });
  }
};

module.exports = { getAll, getById };
