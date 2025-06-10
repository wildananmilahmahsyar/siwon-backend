// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('siwon', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
