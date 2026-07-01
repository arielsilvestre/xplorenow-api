const { Review, Activity, User } = require('../../models');

const toDto = (review) => {
  const plain = review.toJSON ? review.toJSON() : review;
  return {
    id_review: plain.id,
    rating: plain.stars,
    guideRating: plain.guideRating ?? null,
    comment: plain.comment,
    activityId: plain.activityId,
    userId: plain.userId,
    createdAt: plain.createdAt,
    activity: plain.activity ? { id: plain.activity.id, title: plain.activity.name } : null,
  };
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [{ model: Activity, as: 'activity', attributes: ['id', 'name'], required: false }],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews.map(toDto));
  } catch (err) {
    console.error('Error fetching my reviews:', err);
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

const create = async (req, res) => {
  try {
    // Acepta { rating, guideRating, comment, activity: { id } } o { activityId, stars, comment }
    const activityId = req.body.activity?.id ?? req.body.activityId;
    const stars = req.body.rating ?? req.body.stars;
    const { guideRating, comment } = req.body;

    if (!activityId || !stars) {
      return res.status(400).json({ message: 'activity.id y rating son requeridos' });
    }

    const existing = await Review.findOne({ where: { userId: req.user.id, activityId } });
    if (existing) {
      return res.status(409).json({ message: 'Ya calificaste esta actividad' });
    }

    const review = await Review.create({
      userId: req.user.id,
      activityId,
      stars,
      comment,
      guideRating: guideRating ?? null,
    });

    const result = await Review.findByPk(review.id, {
      include: [{ model: Activity, as: 'activity', attributes: ['id', 'name'], required: false }],
    });
    res.status(201).json(toDto(result));
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Error al guardar reseña' });
  }
};

module.exports = { getMyReviews, create };
