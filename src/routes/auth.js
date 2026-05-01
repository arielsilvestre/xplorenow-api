const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me, verifyEmail, resendOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  login
);

router.get('/me', authenticate, me);

router.post(
  '/verify-email',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos'),
  ],
  validate,
  verifyEmail
);

router.post(
  '/resend-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('type').isIn(['email_verification', 'password_reset']).withMessage('Tipo inválido'),
  ],
  validate,
  resendOtp
);

router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
  ],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos'),
    body('newPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  resetPassword
);

module.exports = router;
