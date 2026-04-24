const { Activity, Destination } = require('../models');

const getAll = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
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
      include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
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
