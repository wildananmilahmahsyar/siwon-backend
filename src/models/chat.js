const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hewanId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

// 🔗 Tambahkan relasi setelah semua model di-load
const User = require('./user');
const Hewan = require('./hewan');

// Relasi utama
Chat.belongsTo(User, { foreignKey: 'userId' });        // Pemohon
Chat.belongsTo(Hewan, { foreignKey: 'hewanId' });      // Hewan yang dibahas
Chat.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' }); // Pengirim pesan (boleh user atau admin, tergantung ID)

module.exports = Chat;
