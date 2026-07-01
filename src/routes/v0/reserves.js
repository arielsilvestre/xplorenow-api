const { Router } = require('express');
const { getHistory, create, cancel } = require('../../controllers/v0/reserveController');
const { getVoucher, checkIn } = require('../../controllers/v0/voucherController');
const { authenticate } = require('../../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/my-history', getHistory);
router.post('/', create);
// check-in debe ir ANTES de /:id/cancel para no ser capturado por el wildcard /:id
router.post('/check-in', checkIn);
router.post('/:id/cancel', cancel);
router.get('/:id/voucher', getVoucher);

module.exports = router;
