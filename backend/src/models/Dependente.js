const db = require('../config/db');

exports.createDependente = async (nome, idade, userId) => {
  const [rows] = await db.execute(
    'INSERT INTO dependentes (id, nome, idade, usuario_id) VALUES (UUID(), ?, ?, ?)',
    [nome, idade, userId]
  );
  return rows;
};

exports.getDependentesByUsuario = async (usuario_id) => {
  const [rows] = await db.execute('SELECT * FROM dependentes WHERE usuario_id = ?', [usuario_id]);
  return rows;
};
