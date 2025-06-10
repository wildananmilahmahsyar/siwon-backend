const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { Op } = require('sequelize');

// ✅ Ambil semua chat antara USER dan ADMIN untuk 1 hewan
// Ambil semua chat antara user & admin untuk satu hewan (tanpa filter senderId)
router.get('/:hewanId', async (req, res) => {
  const { hewanId } = req.params;
  try {
    const chats = await Chat.findAll({
      where: { hewanId },
      order: [['timestamp', 'ASC']]
    });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal ambil chat' });
  }
});


// ✅ Simpan pesan
router.post('/', async (req, res) => {
  const { userId, hewanId, senderId, message } = req.body;
  try {
    const newMsg = await Chat.create({ userId, hewanId, senderId, message });
    res.status(201).json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal simpan pesan' });
  }
});

module.exports = router;
