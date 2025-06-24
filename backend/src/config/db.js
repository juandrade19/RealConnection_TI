const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});

module.exports = db;
