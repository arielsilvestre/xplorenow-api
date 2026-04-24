const { Favorite, Activity, Destination } = require('../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'description', 'price', 'capacity', 'imageUrl', 'category'],
  include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
};

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [activityInclude],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, message: 'Error al obtener favoritos' });
  }
};

const toggle = async (req, res) => {
  try {
    const { activityId } = req.params;
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, activityId },
    });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, isFavorite: false });
    }
    await Favorite.create({ userId: req.user.id, activityId });
    res.status(201).json({ success: true, isFavorite: true });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar favorito' });
  }
};

module.exports = { getMyFavorites, toggle };
