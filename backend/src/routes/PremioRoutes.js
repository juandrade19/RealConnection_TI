const express = require('express');
const router = express.Router();
const controller = require('../controllers/PremioControllers');

router.post('/', controller.criarPremio);

module.exports = router;