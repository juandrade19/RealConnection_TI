const { Premio } = require('../models/Premio');
const { v4: uuidv4 } = require('uuid');

exports.criarPremio = async (req, res) => {
  try {
    const { descricao, pontos } = req.body;
    const novoPremio = await Premio.create({
      id: uuidv4(),
      descricao,
      pontos
    });
    res.status(201).json(novoPremio);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
