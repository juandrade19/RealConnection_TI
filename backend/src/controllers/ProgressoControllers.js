const { Progresso } = require('../models/Progresso');
const { v4: uuidv4 } = require('uuid');

exports.registrarProgresso = async (req, res) => {
  try {
    const { dependenteId, atividadeId, concluido } = req.body;
    const novoProgresso = await Progresso.create({
      id: uuidv4(),
      dependenteId,
      atividadeId,
      concluido
    });
    res.status(201).json(novoProgresso);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
