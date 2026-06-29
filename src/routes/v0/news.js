const { Router } = require('express');
const { getAll, getById } = require('../../controllers/v0/newsController');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
