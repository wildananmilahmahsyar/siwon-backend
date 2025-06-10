const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('siwon_seldompen', 'siwon_seldompen', '40b8a29be539ebe3f9e8123ba619ab9a2c891154', {
  host: 'vaj-u.h.filess.io',
  port: 61001,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
