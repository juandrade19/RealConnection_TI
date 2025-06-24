const { Resgate, Premio, Dependente } = require('../models/Resgate');

const criarResgate = async (req, res) => {
  try {
    const { dependenteId, premioId } = req.body;

    const resgate = await Resgate.create({ dependenteId, premioId });
    res.status(201).json(resgate);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar resgate' });
  }
};

const listarResgates = async (req, res) => {
  try {
    const resgates = await Resgate.findAll({ include: [Premio, Dependente] });
    res.json(resgates);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar resgates' });
  }
};

module.exports = {
  criarResgate,
  listarResgates
};