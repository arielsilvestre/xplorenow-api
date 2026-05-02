const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { getMyFavorites, toggle, toggleDestination } = require('../controllers/favoriteController');

const router = Router();

router.use(authenticate);

router.get('/me', getMyFavorites);
router.post('/toggle', toggle);
router.post('/toggle-destination', toggleDestination);

module.exports = router;
