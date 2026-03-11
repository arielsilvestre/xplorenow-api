const { Router } = require('express');
const authRoutes = require('./auth');

const router = Router();

router.use('/auth', authRoutes);

// Add new route modules here as features are implemented:
// router.use('/activities', require('./activities'));
// router.use('/destinations', require('./destinations'));
// router.use('/guides', require('./guides'));
// router.use('/reservations', require('./reservations'));

module.exports = router;
