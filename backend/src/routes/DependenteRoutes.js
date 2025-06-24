const express = require('express');
const router = express.Router();
const dependenteController = require('../controllers/DependenteControllers');

router.post('/', dependenteController.create);
router.get('/:usuario_id', dependenteController.list);

module.exports = router;