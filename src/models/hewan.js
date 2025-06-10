const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Admin = require('./admin'); // Ganti dari user.js ke admin.js

const Hewan = sequelize.define('Hewan', {
  nama: DataTypes.STRING,
  jenis: DataTypes.STRING,
  umur: DataTypes.STRING,
  kondisi: DataTypes.STRING,
  foto: DataTypes.TEXT,
  isAdopted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
  },
  adminId: { // ganti userId → adminId
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Admins', // Nama tabel sesuai Sequelize
      key: 'id'
    }
  }
});

// Relasi ke Admin, bukan lagi User
Admin.hasMany(Hewan, { foreignKey: 'adminId' });
Hewan.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Hewan;
