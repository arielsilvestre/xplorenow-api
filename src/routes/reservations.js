const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { getMyReservations, create } = require('../controllers/reservationController');

const router = Router();

router.use(authenticate);

router.get('/me', getMyReservations);
router.post('/', create);

module.exports = router;
