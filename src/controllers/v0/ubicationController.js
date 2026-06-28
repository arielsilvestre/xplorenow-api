const { Destination } = require('../../models');

const toDto = (dest) => ({
  id_destination: dest.id,
  name: dest.name,
  description: dest.description,
  imageUrl: dest.imageUrl,
  country: dest.country ?? null,
  latitude: dest.latitude,
  longitude: dest.longitude,
});

const getAll = async (req, res) => {
  try {
    const destinations = await Destination.findAll({ order: [['name', 'ASC']] });
    res.json(destinations.map(toDto));
  } catch (err) {
    console.error('Error fetching ubications:', err);
    res.status(500).json({ message: 'Error al obtener ubicaciones' });
  }
};

const getById = async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Ubicación no encontrada' });
    res.json(toDto(dest));
  } catch (err) {
    console.error('Error fetching ubication:', err);
    res.status(500).json({ message: 'Error al obtener ubicación' });
  }
};

module.exports = { getAll, getById };
