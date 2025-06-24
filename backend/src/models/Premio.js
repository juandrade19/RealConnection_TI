const db = require('../config/db');

exports.createPremio = async (titulo, descricao, pontos_necessarios) => {
  const [rows] = await db.execute(
    'INSERT INTO premios (id, titulo, descricao, pontos_necessarios) VALUES (UUID(), ?, ?, ?)',
    [titulo, descricao, pontos_necessarios]
  );
  return rows;
};

exports.getPremios = async () => {
  const [rows] = await db.execute('SELECT * FROM premios');
  return rows;
};