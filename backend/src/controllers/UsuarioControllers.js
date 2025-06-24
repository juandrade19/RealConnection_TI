const { Usuario } = require('../models/Usuarios');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

const criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, crm } = req.body;

  try {
    if (tipo === 'psicologo' && !crm) {
      return res.status(400).json({ error: 'CRM é obrigatório para psicólogos' });
    }

    const usuario = await Usuario.create({
      id: uuidv4(),
      nome,
      email,
      senha,
      tipo,
      crm: tipo === 'psicologo' ? crm : null
    });

    res.status(201).json(usuario);
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao criar usuário', detalhes: error.message });
  }
};


const login = async (req, res) => {
  const { email, senha, crm } = req.body;

  try {
    let usuario;

    if (crm) {
      usuario = await Usuario.findOne({ where: { crm, tipo: 'psicologo' } });
    } else {
      usuario = await Usuario.findOne({ where: { email, tipo: 'familia' } });
    }

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login', detalhes: error.message });
  }
};


const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};


const buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};


const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const deletado = await Usuario.destroy({ where: { id } });
    if (!deletado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
};

module.exports = {
  criarUsuario,
  login,
  listarUsuarios,
  buscarUsuarioPorId,
  excluirUsuario
};
