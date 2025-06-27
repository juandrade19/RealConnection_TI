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
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
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
    unique: true,
    validate: {
      isCrmConsistente(value) {
        if (this.tipo === 'psicologo' && !value) {
          throw new Error('CRM é obrigatório para psicólogos.');
        }
        if (this.tipo === 'familia' && value) {
          throw new Error('Usuários do tipo "família" não devem ter CRM.');
        }
      }
    }
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
});

module.exports = { Usuario };
