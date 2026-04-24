const { Destination } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destino no encontrado' });
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById };
