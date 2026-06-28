const { Router } = require('express');
const { getHistory, create, cancel } = require('../../controllers/v0/reserveController');
const { authenticate } = require('../../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/my-history', getHistory);
router.post('/', create);
router.post('/:id/cancel', cancel);

module.exports = router;
