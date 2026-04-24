const { Router } = require('express');
const authRoutes = require('./auth');

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', require('./destinations'));

// Add new route modules here as features are implemented:
// router.use('/activities', require('./activities'));
// router.use('/guides', require('./guides'));
// router.use('/reservations', require('./reservations'));

module.exports = router;
