const { Atividade } = require('../models/Atividade');
const { v4: uuidv4 } = require('uuid');

exports.criarAtividade = async (req, res) => {
  try {
    const { titulo, descricao, pontos, data, criado_por } = req.body;

    if (!titulo || !descricao || !pontos || !data) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

        console.log('Dados recebidos para criar atividade:', req.body);

    const novaAtividade = await Atividade.create({
  id: uuidv4(),
  titulo,
  descricao,
  pontos,
  data,
  criado_por,
});
    res.status(201).json(novaAtividade);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
