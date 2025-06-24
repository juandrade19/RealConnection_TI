const express = require('express');
const router = express.Router();
const resgateController = require('../controllers/ResgateControllers');

router.post('/', resgateController.criarResgate);
router.get('/', resgateController.listarResgates);

module.exports = router;