const { Usuario } = require('../models/Usuarios');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';


const senhaHash = await bcrypt.hash(senha, 10);


const criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, crm } = req.body;

  try {
    // Validação manual antes de salvar
    if (tipo === 'psicologo' && !crm) {
      return res.status(400).json({ error: 'CRM é obrigatório para psicólogos.' });
    }

    if (tipo === 'familia' && crm) {
      return res.status(400).json({ error: 'Usuários do tipo "família" não devem ter CRM.' });
    }

    const usuario = await Usuario.create({
  id: uuidv4(),
  nome,
  email,
  senha: senhaHash,
  tipo,
  crm: tipo === 'psicologo' ? crm : null
});

    res.status(201).json(usuario);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0].path;
      return res.status(409).json({ error: `Já existe um usuário com este ${field}.` });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ error: 'Dados inválidos.', detalhes: error.errors.map(e => e.message) });
    }

    res.status(500).json({ error: 'Erro ao criar usuário.', detalhes: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha, crm, tipo } = req.body;

  try {
    let usuario;

    // Validação de tipo obrigatório
    if (!tipo || !['familia', 'psicologo'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido ou ausente.' });
    }

    if (tipo === 'psicologo') {
      if (!crm) {
        return res.status(400).json({ error: 'CRM é obrigatório para psicólogos.' });
      }
      usuario = await Usuario.findOne({ where: { crm, tipo } });
    } else {
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório para usuários do tipo "família".' });
      }
      usuario = await Usuario.findOne({ where: { email, tipo } });
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo,
      email: usuario.email,
      crm: usuario.crm
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login.', detalhes: error.message });
  }
};



const perfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const deletado = await Usuario.destroy({ where: { id } });
    if (!deletado) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: 'Usuário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};

module.exports = {
  criarUsuario,
  login,
  listarUsuarios,
  buscarUsuarioPorId,
  excluirUsuario,
  perfilUsuario
};
