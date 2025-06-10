const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
const sequelize = require('./src/config/db');
const userRoutes = require('./src/routes/user');
const hewanRoutes = require('./src/routes/hewan');
const pengajuanRoutes = require('./src/routes/pengajuan');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/uploads');
const path = require('path');

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
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('[✅] Database connected & synchronized with Sequelize.');

  app.listen(PORT, () => {
    console.log(`[🚀] Server berjalan di http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('[❌] Error saat koneksi database:', err);
});
