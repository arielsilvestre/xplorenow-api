const { Router } = require('express');
const { poll } = require('../../controllers/v0/notificationController');
const { authenticate } = require('../../middlewares/auth');

const router = Router();

router.get('/poll', authenticate, poll);

module.exports = router;
