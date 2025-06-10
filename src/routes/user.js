const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken'); 
const router = express.Router();

// --- REGISTRASI (ADMIN & USER) ---
console.log('[Router] User route aktif');
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Cek apakah email sudah dipakai
    const existingUser = await User.findOne({ where: { email } });
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingUser || existingAdmin) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Jika email mengandung 'admin', buat akun di kedua tabel
    if (email.toLowerCase().startsWith('admin')) {
      const newAdmin = await Admin.create({ username, email, password: hashedPassword });
      const mirrorUser = await User.create({ username, email, password: hashedPassword });

      return res.status(201).json({
        message: 'Admin registered',
        user: newAdmin,
        mirrorId: mirrorUser.id
      });
    }

    // Kalau bukan admin, simpan hanya di tabel user
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered', user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal registrasi user/admin' });
  }
});

// --- LOGIN ADMIN & USER ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user, mirrorUser;

    if (email.toLowerCase().startsWith('admin')) {
      user = await Admin.findOne({ where: { email } });
      mirrorUser = await User.findOne({ where: { email } });

      if (!user || !mirrorUser) {
        return res.status(404).json({ error: 'Admin tidak ditemukan' });
      }
    } else {
      user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password salah' });
      }

      const payload = {
        id: mirrorUser ? mirrorUser.id : user.id,
        adminId: mirrorUser ? user.id : null,
        username: user.username,
        email: user.email,
        role: email.startsWith('admin') ? 'admin' : 'user'
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({
        token,
        user: payload,
        role: payload.role
      });
      
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat login' });
  }
  
});





module.exports = router;
