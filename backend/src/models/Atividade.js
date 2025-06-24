const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Atividade = db.define('Atividade', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pontos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
 data: {
  type: DataTypes.DATEONLY,
  allowNull: false,
},
  criado_por: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'atividades',
  createdAt: 'criado_em',
  updatedAt: false,
});

module.exports = { Atividade };
