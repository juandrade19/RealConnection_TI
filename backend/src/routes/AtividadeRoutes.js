const express = require('express');
const router = express.Router();
const controller = require('../controllers/AtividadeControllers');

router.post('/', controller.criarAtividade);

module.exports = router;
