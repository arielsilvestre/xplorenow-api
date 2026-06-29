const { Router } = require('express');
const { getMe, updateMe } = require('../../controllers/v0/travellerController');
const { authenticate } = require('../../middlewares/auth');

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

module.exports = router;
