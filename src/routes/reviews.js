const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { create, getByActivity } = require('../controllers/reviewController');

const router = Router();

router.get('/activity/:activityId', getByActivity);
router.post('/', authenticate, create);

module.exports = router;
