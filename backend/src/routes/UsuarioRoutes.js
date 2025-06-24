const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioControllers');
const autenticar = require('../middlewares/autenticacao');

router.post('/registrar', usuarioController.criarUsuario);
router.post('/login', usuarioController.login);


router.get('/', autenticar, usuarioController.listarUsuarios);
router.get('/:id', autenticar, usuarioController.buscarUsuarioPorId);
router.delete('/:id', autenticar, usuarioController.excluirUsuario);

module.exports = router;
