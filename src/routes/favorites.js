const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { getMyFavorites, toggle } = require('../controllers/favoriteController');

const router = Router();

router.use(authenticate);

router.get('/', getMyFavorites);
router.post('/:activityId', toggle);

module.exports = router;
