const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

router.post('/image', authenticate, uploadImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Файл не загружен' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const type = req.body.type || req.query.type || 'content';
    const url = `${baseUrl}/uploads/${type === 'cover' ? 'covers' : 'content'}/${req.file.filename}`;

    res.json({
      success: true,
      data: { url, filename: req.file.filename, size: req.file.size }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка загрузки' });
  }
});

module.exports = router;