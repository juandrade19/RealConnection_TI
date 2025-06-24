const db = require('../config/db');

exports.resgatarPremio = async (dependente_id, premio_id) => {
  const [rows] = await db.execute(
    'INSERT INTO resgates (id, dependente_id, premio_id, data_resgate) VALUES (UUID(), ?, ?, NOW())',
    [dependente_id, premio_id]
  );
  return rows;
};

exports.getResgates = async (dependente_id) => {
  const [rows] = await db.execute(
    'SELECT r.*, p.titulo FROM resgates r JOIN premios p ON r.premio_id = p.id WHERE r.dependente_id = ?',
    [dependente_id]
  );
  return rows;
};