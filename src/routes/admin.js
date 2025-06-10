const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat admin' });
  }
});

module.exports = router;
