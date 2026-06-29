const { Router } = require('express');
const { register, login, requestOtp, verifyOtp, changePassword, changeEmail } = require('../../controllers/v0/authController');
const { authenticate } = require('../../middlewares/auth');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/otp/request', authLimiter, requestOtp);
router.post('/otp/verify', authLimiter, verifyOtp);
router.post('/change-password', authenticate, changePassword);
router.post('/change-email', authenticate, changeEmail);

module.exports = router;
