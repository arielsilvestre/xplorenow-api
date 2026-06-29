const { Router } = require('express');
const { getMyReviews, create } = require('../../controllers/v0/reviewController');
const { authenticate } = require('../../middlewares/auth');

const router = Router();

router.get('/my', authenticate, getMyReviews);
router.post('/', authenticate, create);

module.exports = router;
