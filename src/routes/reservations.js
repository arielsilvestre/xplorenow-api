const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { getMyReservations, getHistory, create, cancel } = require('../controllers/reservationController');

const router = Router();

router.use(authenticate);

router.get('/me', getMyReservations);
router.get('/history', getHistory);
router.post('/', create);
router.patch('/:id/cancel', cancel);

module.exports = router;
