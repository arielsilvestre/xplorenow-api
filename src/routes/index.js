const { Router } = require('express');
const authRoutes = require('./auth');

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', require('./destinations'));

router.use('/activities', require('./activities'));
router.use('/reservations', require('./reservations'));

// router.use('/guides', require('./guides'));

module.exports = router;
