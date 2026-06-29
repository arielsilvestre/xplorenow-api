const { literal } = require('sequelize');
const { Destination, Activity } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
};

// Literal para cupos disponibles — usa alias "activities" (el as del include)
const availableSpotsLiteral = literal(`(
  "activities"."capacity" - COALESCE((
    SELECT SUM(r.people)
    FROM "Reservations" r
    WHERE r."activityId" = "activities"."id"
    AND r.status IN ('pending', 'confirmed')
  ), 0)
)`);

const getById = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id, {
      include: [{
        model: Activity,
        as: 'activities',
        attributes: [
          'id', 'name', 'description', 'price', 'category', 'imageUrl',
          'duration', 'capacity',
          [availableSpotsLiteral, 'availableSpots'],
        ],
      }],
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destino no encontrado' });
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById };
