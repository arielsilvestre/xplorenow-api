const { Router } = require('express');
const {
  getAll, getById, getFeatured, getCategories,
  search, getMostVisited, getTopRated, getRecommendations,
} = require('../../controllers/v0/activityController');

const router = Router();

// Rutas específicas ANTES de /:id para evitar conflictos
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/search', search);
router.get('/most-visited', getMostVisited);
router.get('/top-rated', getTopRated);
router.get('/recommendations', getRecommendations);

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
