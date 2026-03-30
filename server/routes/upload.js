const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const pool    = require('../db/pool');
const auth    = require('../middleware/auth');

// Файлды сақтау конфигурациясы
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Уникальное имя файла: userId + timestamp + extension
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  }
});

// Тек сурет файлдарын қабылдау
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB максимум
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// POST /api/upload/avatar — аватар жүктеу
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Файл URL жасау
    const avatarUrl = `/uploads/${req.file.filename}`;

    // Дерекқорда аватарды жаңарту
    await pool.query(
      'UPDATE users SET avatar = $1 WHERE id = $2',
      [avatarUrl, req.user.id]
    );

    res.json({ success: true, avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;