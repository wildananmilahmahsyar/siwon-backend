const express = require('express');
const router = express.Router();
const Pengajuan = require('../models/pengajuan');
const Hewan = require('../models/hewan');
const User = require('../models/user');

// POST /api/pengajuan
// Gunakan upload.single untuk file
router.post('/', async (req, res) => {
  try {
    const {
      nama, jenisKelamin, tanggalLahir,
      email, noHp, alamat, alasan,
      userId, hewanId, foto
    } = req.body;

    const hewan = await Hewan.findByPk(hewanId);
    if (!hewan) return res.status(404).json({ error: 'Hewan tidak ditemukan' });

    const pengajuan = await Pengajuan.create({
      nama,
      jenisKelamin,
      tanggalLahir,
      email,
      noHp,
      alamat,
      alasan,
      foto: foto ? `/uploads/${foto}` : null,
      userId,
      hewanId,
      adminId: hewan.adminId
    });

    res.status(201).json(pengajuan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengirim pengajuan' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Hewan }, { model: User }]
    });
    res.json(pengajuan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/pengajuan/:id/status
// PATCH status pengajuan
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updated = await Pengajuan.update({ status }, { where: { id } });
    if (status === 'diterima') {
      const pengajuan = await Pengajuan.findByPk(id);
      await Hewan.update({ isAdopted: true }, { where: { id: pengajuan.hewanId } });
    }
    res.json({ message: 'Status diperbarui', updated });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui status' });
  }
});


/// GET pengajuan menunggu (khusus admin)
router.get('/menunggu', async (req, res) => {
  try {
    
    const { adminId } = req.query;
    if (!adminId) return res.status(400).json({ error: 'adminId wajib disertakan' });
    const pengajuan = await Pengajuan.findAll({
      
      where: {
        status: 'menunggu',
        adminId
      },
      include: [{ model: Hewan }, { model: User }]
    });

    res.json(pengajuan);
  } catch (err) {
    console.error(err);
    
    res.status(500).json({ error: 'Gagal mengambil pengajuan' });
  }
});

router.get('/hewan/:hewanId', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findAll({
      where: { hewanId: req.params.hewanId },
      order: [['createdAt', 'DESC']],
       include: [{ model: Hewan }, { model: User }]
      
    });
    res.json(pengajuan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findByPk(req.params.id, {
      include: [{ model: Hewan }, { model: User }]
    });
    res.json(pengajuan);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail pengajuan' });
  }
});


// PATCH /api/pengajuan/:id/batal
// Membatalkan pengajuan adopsi
router.patch('/:id/batal', async (req, res) => {
  try {
    const { id } = req.params;

    const pengajuan = await Pengajuan.findByPk(id);
    if (!pengajuan) {
      return res.status(404).json({ error: 'Pengajuan tidak ditemukan' });
    }

    // Ubah status menjadi 'dibatalkan'
    await pengajuan.update({ status: 'dibatalkan' });

    res.json({ message: 'Pengajuan berhasil dibatalkan', pengajuan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membatalkan pengajuan' });
  }
});



module.exports = router;