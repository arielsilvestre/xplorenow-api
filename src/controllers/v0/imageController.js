const { Image } = require('../../models');

const getRaw = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Imagen no encontrada' });
    // Redirigir a la URL real de la imagen
    res.redirect(302, image.url);
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ message: 'Error al obtener imagen' });
  }
};

module.exports = { getRaw };
