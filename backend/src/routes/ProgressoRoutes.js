const express = require('express');
const router = express.Router();
const controller = require('../controllers/ProgressoControllers');

router.post('/', controller.registrarProgresso);

module.exports = router;