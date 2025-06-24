const Dependente = require('../models/Dependente');

exports.create = async (req, res) => {
  const { nome, idade, usuario_id } = req.body;
  try {
    await Dependente.createDependente(nome, idade, usuario_id);
    res.status(201).json({ message: 'Dependente criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const dependentes = await Dependente.getDependentesByUsuario(req.params.usuario_id);
    res.json(dependentes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
