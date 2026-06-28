const { Router } = require('express');
const { getAll, getById } = require('../../controllers/v0/disponibilityController');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
