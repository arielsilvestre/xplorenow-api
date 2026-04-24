const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { getMe, updateMe } = require('../controllers/userController');

const router = Router();

router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', updateMe);

module.exports = router;
