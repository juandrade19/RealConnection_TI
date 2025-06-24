const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('familia', 'psicologo'),
    allowNull: false,
  },
  crm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { Usuario };
