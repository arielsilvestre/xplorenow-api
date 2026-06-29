const { Router } = require('express');
const { getRaw } = require('../../controllers/v0/imageController');

const router = Router();

router.get('/:id/raw', getRaw);

module.exports = router;
