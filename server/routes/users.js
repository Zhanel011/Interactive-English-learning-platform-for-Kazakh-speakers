const router = require('express').Router();
const pool   = require('../db/pool');
const auth   = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [userRes, progressRes, wordsRes] = await Promise.all([
      pool.query(
        'SELECT id,name,email,level,xp,streak,avatar,created_at FROM users WHERE id=$1',
        [req.user.id]
      ),
      pool.query(
        'SELECT COUNT(*) AS lessons_completed FROM user_lesson_progress WHERE user_id=$1 AND completed=true',
        [req.user.id]
      ),
      pool.query(
        'SELECT COUNT(*) AS words_learned FROM user_words WHERE user_id=$1',
        [req.user.id]
      ),
    ]);
    res.json({
      ...userRes.rows[0],
      lessons_completed: parseInt(progressRes.rows[0].lessons_completed),
      words_learned:     parseInt(wordsRes.rows[0].words_learned),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, level, xp, streak, avatar,
        RANK() OVER (ORDER BY xp DESC) AS rank
      FROM users
      WHERE role = 'student'
      ORDER BY xp DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/profile — жартылай жаңарту
router.patch('/profile', auth, async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET name=COALESCE($1,name), avatar=COALESCE($2,avatar) WHERE id=$3 RETURNING id,name,avatar',
      [name, avatar, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile — толық жаңарту
router.put('/profile', auth, async (req, res) => {
  const { name, avatar, level } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const { rows } = await pool.query(
      `UPDATE users 
       SET name=$1, avatar=COALESCE($2,avatar), level=COALESCE($3,level)
       WHERE id=$4 
       RETURNING id,name,avatar,level,xp,streak`,
      [name, avatar, level, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/profile — аккаунтты жою
router.delete('/profile', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.user.id]);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/all — тек admin үшін
router.get('/all', auth, async (req, res) => {
  try {
    const meRes = await pool.query('SELECT role FROM users WHERE id=$1', [req.user.id]);
    if (meRes.rows[0]?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { rows } = await pool.query(`
      SELECT u.id, u.name, u.email, u.level, u.xp, u.streak, u.avatar, u.role, u.created_at,
        COUNT(DISTINCT p.lesson_id) FILTER (WHERE p.completed=true) AS lessons_completed,
        COUNT(DISTINCT uw.word_id) AS words_learned
      FROM users u
      LEFT JOIN user_lesson_progress p ON p.user_id = u.id
      LEFT JOIN user_words uw ON uw.user_id = u.id
      GROUP BY u.id
      ORDER BY u.xp DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id — admin пайдаланушыны жояды
router.delete('/:id', auth, async (req, res) => {
  try {
    const meRes = await pool.query('SELECT role FROM users WHERE id=$1', [req.user.id]);
    if (meRes.rows[0]?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
