const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/db');
const hewanRoutes = require('./src/routes/hewan');
const pengajuanRoutes = require('./src/routes/pengajuan');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/uploads');
const path = require('path');

const app = express();
router.options('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://siwon-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200);
});

// ✅ CORS MANUAL FIX (untuk semua jenis request)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://siwon-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ GLOBAL OPTIONS Handler untuk preflight CORS
app.options('*', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://siwon-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ✅ Middleware standar
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// ✅ Register route /api/users dengan pengecekan error
try {
  const userRoutes = require('./src/routes/user');
  app.use('/api/users', userRoutes);
  console.log('[✅] Route /api/users terdaftar.');
} catch (err) {
  console.error('❌ Gagal mendaftarkan route /api/users:', err);
}

// ✅ Route lainnya
app.use('/api/hewan', hewanRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Jalankan server setelah koneksi ke DB
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('[✅] Database connected & synchronized with Sequelize.');

    app.listen(PORT, () => {
      console.log(`[🚀] Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[❌] Error saat koneksi database:', err);
  });
