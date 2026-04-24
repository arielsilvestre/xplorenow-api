const { Review, User } = require('../models');

const create = async (req, res) => {
  try {
    const { activityId, stars, comment } = req.body;
    if (!activityId || !stars) {
      return res.status(400).json({ success: false, message: 'activityId y stars son requeridos' });
    }
    const existing = await Review.findOne({ where: { userId: req.user.id, activityId } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Ya calificaste esta actividad' });
    }
    const review = await Review.create({ userId: req.user.id, activityId, stars, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Error al guardar calificación' });
  }
};

const getByActivity = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { activityId: req.params.activityId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Error al obtener calificaciones' });
  }
};

module.exports = { create, getByActivity };
