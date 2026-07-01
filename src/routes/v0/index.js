const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth'));
router.use('/activities', require('./activities'));
router.use('/disponibilities', require('./disponibilities'));
router.use('/images', require('./images'));
router.use('/news', require('./news'));
router.use('/reserves', require('./reserves'));
router.use('/travellers', require('./travellers'));
router.use('/ubications', require('./ubications'));
router.use('/reviews', require('./reviews'));
router.use('/notifications', require('./notifications'));

module.exports = router;
