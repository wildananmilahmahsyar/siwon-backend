const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const sequelize = require('./src/config/db');

// 🔁 Pastikan semua model di-load sebelum sync
require('./src/models/admin');
require('./src/models/user');
require('./src/models/hewan');
require('./src/models/pengajuan');
require('./src/models/chat');

// 🔀 Import semua route
const userRoutes = require('./src/routes/user');
const hewanRoutes = require('./src/routes/hewan');
const pengajuanRoutes = require('./src/routes/pengajuan');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 CORS untuk frontend Vercel
const CLIENT_ORIGIN = "https://siwon-frontend.vercel.app";
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 🧱 Middleware untuk parsing JSON dan URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🖼️ Serve file upload
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// 🛣️ Routes
app.use('/api/users', userRoutes);
app.use('/api/hewan', hewanRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 🚀 Start server setelah sync DB
sequelize.sync({ alter: false })
  .then(() => {
    console.log('[✅] Database connected & synchronized with Sequelize.');
    app.listen(PORT, () => {
      console.log(`[🚀] Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[❌] Database connection error:', err);
  });
