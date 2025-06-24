const db = require('../config/db');

exports.marcarAtividadeConcluida = async (dependente_id, atividade_id) => {
  const [rows] = await db.execute(
    'INSERT INTO progresso (id, dependente_id, atividade_id, data_conclusao) VALUES (UUID(), ?, ?, NOW())',
    [dependente_id, atividade_id]
  );
  return rows;
};

exports.getProgresso = async (dependente_id) => {
  const [rows] = await db.execute(
    'SELECT p.*, a.titulo, a.pontuacao FROM progresso p JOIN atividades a ON p.atividade_id = a.id WHERE p.dependente_id = ?',
    [dependente_id]
  );
  return rows;
};