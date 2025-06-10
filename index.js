const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
const sequelize = require('./src/config/db');          // ✅ Fix path
const userRoutes = require('./src/routes/user');       // ✅ Fix path
const hewanRoutes = require('./src/routes/hewan');   // ✅ Fix path
const pengajuanRoutes = require('./src/routes/pengajuan');
const Pengajuan = require('./src/models/pengajuan');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/uploads'); // ✅ Tambahkan ini
const path = require('path'); // ✅ Tambahkan ini

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/hewan', hewanRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admins', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads'))); // ✅ BENAR
app.use('/api/upload', uploadRoutes);


sequelize.sync({ alter: true }).then(() => {
  console.log('[✅] Database connected & synchronized with Sequelize.');

  app.listen(5000, () => {
    console.log('[🚀] Server berjalan di http://localhost:5000');
  });
}).catch((err) => {
  console.error('[❌] Error saat koneksi database:', err);
});

