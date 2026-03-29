const router = require('express').Router();
const pool   = require('../db/pool');
const auth   = require('../middleware/auth');

// GET /api/words
router.get('/', auth, async (req, res) => {
  const { search, category } = req.query;
  try {
    let query = `
      SELECT w.*, CASE WHEN uw.id IS NOT NULL THEN true ELSE false END AS learned
      FROM words w
      LEFT JOIN user_words uw ON uw.word_id = w.id AND uw.user_id = $1
      WHERE 1=1
    `;
    const params = [req.user.id];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (w.english ILIKE $${params.length} OR w.kazakh ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      query += ` AND w.category = $${params.length}`;
    }
    query += ' ORDER BY w.level, w.english';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/words/:id/learn
router.post('/:id/learn', auth, async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO user_words (user_id, word_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, word_id) DO UPDATE
        SET times_reviewed = user_words.times_reviewed + 1
    `, [req.user.id, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/words/my
router.get('/my', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT w.*, uw.times_reviewed, uw.learned_at
      FROM words w
      JOIN user_words uw ON uw.word_id = w.id
      WHERE uw.user_id = $1
      ORDER BY uw.learned_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;