const { Favorite, FavoriteDestination, Activity, Destination } = require('../models');

const activityInclude = {
  model: Activity,
  as: 'activity',
  attributes: ['id', 'name', 'description', 'price', 'capacity', 'imageUrl', 'category'],
  include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }],
};

const destinationInclude = {
  model: Destination,
  as: 'destination',
  attributes: ['id', 'name', 'description', 'imageUrl', 'latitude', 'longitude'],
};

const getMyFavorites = async (req, res) => {
  try {
    const [favAct, favDest] = await Promise.all([
      Favorite.findAll({
        where: { userId: req.user.id },
        include: [activityInclude],
        order: [['createdAt', 'DESC']],
      }),
      FavoriteDestination.findAll({
        where: { userId: req.user.id },
        include: [destinationInclude],
        order: [['createdAt', 'DESC']],
      }),
    ]);
    res.json({
      success: true,
      data: {
        activities: favAct.map(f => f.activity),
        destinations: favDest.map(f => f.destination),
      },
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, message: 'Error al obtener favoritos' });
  }
};

const toggle = async (req, res) => {
  try {
    const { activityId } = req.body;
    if (!activityId) {
      return res.status(400).json({ success: false, message: 'activityId requerido' });
    }
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

const toggleDestination = async (req, res) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId requerido' });
    }
    const existing = await FavoriteDestination.findOne({
      where: { userId: req.user.id, destinationId },
    });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, isFavorite: false });
    }
    await FavoriteDestination.create({ userId: req.user.id, destinationId });
    res.status(201).json({ success: true, isFavorite: true });
  } catch (error) {
    console.error('Error toggling destination favorite:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar favorito de destino' });
  }
};

module.exports = { getMyFavorites, toggle, toggleDestination };
