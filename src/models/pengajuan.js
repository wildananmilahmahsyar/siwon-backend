const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Admin = require('./admin'); // 🆕 Tambahkan
const Hewan = require('./hewan');

const Pengajuan = sequelize.define('Pengajuan', {
  nama: DataTypes.STRING,
  jenisKelamin: DataTypes.STRING,
  tanggalLahir: DataTypes.DATEONLY,
  email: DataTypes.STRING,
  noHp: DataTypes.STRING,
  alamat: DataTypes.STRING,
  alasan: DataTypes.TEXT,
  foto: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'menunggu'
  }
});

// Relasi utama
Pengajuan.belongsTo(User, { foreignKey: 'userId' }); // pemohon
Pengajuan.belongsTo(Admin, { as: 'Admin', foreignKey: 'adminId' }); // 🆕 pemilik hewan
Pengajuan.belongsTo(Hewan, { foreignKey: 'hewanId' }); // hewan yang diajukan

module.exports = Pengajuan;
