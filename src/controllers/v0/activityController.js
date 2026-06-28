const { Op, literal, fn, col } = require('sequelize');
const { Activity, Destination, TourGuide, Availability, Review, Image, Reservation } = require('../../models');

const ratingLiteral = literal(`(
  SELECT COALESCE(AVG(r.stars), 0)
  FROM "Reviews" r
  WHERE r."activityId" = "Activity"."id"
)`);

const reservationCountLiteral = literal(`(
  SELECT COUNT(*)
  FROM "Reservations" r
  WHERE r."activityId" = "Activity"."id"
  AND r.status IN ('pending', 'confirmed')
)`);

const toDto = (activity) => {
  const plain = activity.toJSON ? activity.toJSON() : activity;
  const images = (plain.images || []).map(img => ({ id: img.id, url: img.url }));
  // fallback: si no hay imágenes en tabla Image, usar imageUrl + photos
  if (images.length === 0 && plain.imageUrl) {
    images.push({ id: null, url: plain.imageUrl });
    (plain.photos || []).forEach((url, i) => images.push({ id: null, url }));
  }

  return {
    id: plain.id,
    title: plain.name,
    description: plain.description,
    price: plain.price,
    rating: plain.rating ? parseFloat(plain.rating) : 0,
    duration: plain.duration,
    category: plain.category,
    inclusions: plain.whatsIncluded,
    meetingPoint: plain.meetingPoint,
    language: plain.language,
    cancellationPolicy: plain.cancellationPolicy,
    departureLat: plain.departureLat,
    departureLng: plain.departureLng,
    ubicationName: plain.destination ? plain.destination.name : null,
    ubicationId: plain.destinationId,
    images,
    disponibilities: (plain.availability || []).map(a => ({
      id_disponibility: a.id,
      hour: a.hour,
      precio: a.precio,
      total_quota: a.totalQuota ?? a.spotsLeft,
      disponibleQuota: a.spotsLeft,
      activityId: a.activityId,
      guideId: a.guideId ?? null,
      date: a.date,
    })),
  };
};

const baseIncludes = [
  { model: Destination, as: 'destination', attributes: ['id', 'name', 'country'] },
  { model: Availability, as: 'availability', required: false },
  { model: Image, as: 'images', required: false },
];

const buildWhere = (query) => {
  const where = {};
  if (query.category) where.category = query.category;
  if (query.categories) where.category = { [Op.in]: query.categories.split(',') };
  if (query.destinationId) where.destinationId = query.destinationId;
  if (query.destination) where.destinationId = query.destination;
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price[Op.gte] = parseFloat(query.minPrice);
    if (query.maxPrice) where.price[Op.lte] = parseFloat(query.maxPrice);
  }
  return where;
};

const getAll = async (req, res) => {
  try {
    const { page = 0, size = 20, sort } = req.query;
    const limit = parseInt(size);
    const offset = parseInt(page) * limit;

    const order = sort === 'price' ? [['price', 'ASC']] : [['createdAt', 'DESC']];

    const activities = await Activity.findAll({
      where: buildWhere(req.query),
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
      order,
      limit,
      offset,
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Error al obtener actividades' });
  }
};

const getById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
    });
    if (!activity) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.json(toDto(activity));
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ message: 'Error al obtener actividad' });
  }
};

const getFeatured = async (req, res) => {
  try {
    const { size = 10 } = req.query;
    const activities = await Activity.findAll({
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
      order: [['createdAt', 'DESC']],
      limit: parseInt(size),
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error fetching featured:', err);
    res.status(500).json({ message: 'Error al obtener destacadas' });
  }
};

const getCategories = async (req, res) => {
  try {
    const results = await Activity.findAll({
      attributes: [[literal('DISTINCT "category"'), 'category']],
      raw: true,
    });
    res.json(results.map(r => r.category));
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

const search = async (req, res) => {
  try {
    const { keyword = '', page = 0, size = 20 } = req.query;
    const limit = parseInt(size);
    const offset = parseInt(page) * limit;

    const activities = await Activity.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
      limit,
      offset,
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error searching activities:', err);
    res.status(500).json({ message: 'Error en búsqueda' });
  }
};

const getMostVisited = async (req, res) => {
  try {
    const { size = 10 } = req.query;
    const activities = await Activity.findAll({
      attributes: { include: [[ratingLiteral, 'rating'], [reservationCountLiteral, 'reservationCount']] },
      include: baseIncludes,
      order: [[literal('"reservationCount"'), 'DESC']],
      limit: parseInt(size),
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error fetching most visited:', err);
    res.status(500).json({ message: 'Error al obtener más visitadas' });
  }
};

const getTopRated = async (req, res) => {
  try {
    const { size = 10 } = req.query;
    const activities = await Activity.findAll({
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
      order: [[literal('"rating"'), 'DESC']],
      limit: parseInt(size),
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error fetching top rated:', err);
    res.status(500).json({ message: 'Error al obtener mejor calificadas' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { size = 10 } = req.query;
    const activities = await Activity.findAll({
      attributes: { include: [[ratingLiteral, 'rating']] },
      include: baseIncludes,
      order: [['createdAt', 'DESC']],
      limit: parseInt(size),
    });
    res.json(activities.map(toDto));
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ message: 'Error al obtener recomendaciones' });
  }
};

module.exports = { getAll, getById, getFeatured, getCategories, search, getMostVisited, getTopRated, getRecommendations };
