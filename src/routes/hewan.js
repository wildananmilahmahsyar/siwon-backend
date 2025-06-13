const express = require('express');
const router = express.Router();
const Hewan = require('../models/hewan');
const { Op } = require('sequelize');

// POST /api/hewan - Tambah data hewan
router.post('/', async (req, res) => {
  try {
    const { nama, jenis, umur, kondisi, foto, adminId } = req.body;
    console.log("Diterima:", req.body); // Debugging log
    console.log("Kondisi:", kondisi); // Debugging log
    console.log('[🧪 QUERY]', { jenis, nama });
    if (!adminId) return res.status(400).json({ error: 'adminId tidak boleh kosong' });
    if (!nama) return res.status(400).json({ error: 'Nama tidak boleh kosong' });
    if (!jenis) return res.status(400).json({ error: 'Jenis tidak boleh kosong' });
    if (!umur) return res.status(400).json({ error: 'Umur tidak boleh kosong' });
    if (!kondisi) return res.status(400).json({ error: 'Kondisi tidak boleh kosong' });
    if (!foto) return res.status(400).json({ error: 'Foto tidak boleh kosong' });



    const newHewan = await Hewan.create({
      nama,
      jenis,
      umur,
      kondisi: JSON.stringify(kondisi),
      foto,
      adminId
    });

    res.status(201).json(newHewan);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menambah data' });
  }
});

// GET all hewan
// GET /api/hewan?userId=6 - Hanya ambil data hewan milik userId tertentu
router.get('/', async (req, res) => {
  try {
    const { adminId, jenis, nama } = req.query;

    let whereClause = {};

    if (adminId) whereClause.adminId = adminId;
    
    // Ubah pencarian berdasarkan nama
    if (nama) {
      whereClause.nama = { [Op.like]: `%${nama}%` };  // Mencari berdasarkan nama
    } else if (jenis) {
      whereClause.jenis = jenis.toLowerCase();
    }

    whereClause.isAdopted = false;
    const hewans = await Hewan.findAll({ where: whereClause });

    if (hewans.length === 0) {
      return res.status(404).json({ message: 'Tidak ditemukan hewan dengan nama tersebut.' });
    }

    res.json(hewans);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal mengambil data hewan' });
  }
});




// GET detail hewan by id
router.get('/:id', async (req, res) => {
  try {
    const hewan = await Hewan.findByPk(req.params.id);
    if (!hewan) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(hewan);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data detail' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Hewan.destroy({ where: { id } });
    if (deleted) return res.status(200).json({ message: 'Deleted' });
    res.status(404).json({ error: 'Data tidak ditemukan' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
});

// PUT (edit)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hewan.update(
      { ...req.body, kondisi: JSON.stringify(req.body.kondisi) },
      { where: { id } }
    );
    res.status(200).json({ message: 'Updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui data' });
  }
});

module.exports = router;
