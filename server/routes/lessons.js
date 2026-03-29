const router = require('express').Router();
const pool   = require('../db/pool');
const auth   = require('../middleware/auth');

// GET /api/lessons
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*,
        COALESCE(p.completed, false) AS completed,
        COALESCE(p.score, 0)         AS user_score,
        COALESCE(p.attempts, 0)      AS attempts
      FROM lessons l
      LEFT JOIN user_lesson_progress p ON p.lesson_id = l.id AND p.user_id = $1
      ORDER BY l.order_num
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lessons/:id/exercises
router.get('/:id/exercises', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM exercises WHERE lesson_id=$1 ORDER BY order_num',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lessons/:id/complete
router.post('/:id/complete', auth, async (req, res) => {
  const { score } = req.body;
  const lessonId  = req.params.id;
  const userId    = req.user.id;

  try {
    await pool.query(`
      INSERT INTO user_lesson_progress (user_id, lesson_id, completed, score, attempts, completed_at)
      VALUES ($1, $2, $3, $4, 1, NOW())
      ON CONFLICT (user_id, lesson_id) DO UPDATE
        SET completed    = EXCLUDED.completed,
            score        = GREATEST(user_lesson_progress.score, EXCLUDED.score),
            attempts     = user_lesson_progress.attempts + 1,
            completed_at = CASE WHEN EXCLUDED.completed THEN NOW() ELSE user_lesson_progress.completed_at END
    `, [userId, lessonId, score >= 60, score]);

    const xpGain = Math.round(score / 2);
    await pool.query('UPDATE users SET xp = xp + $1 WHERE id = $2', [xpGain, userId]);

    res.json({ success: true, xp_gained: xpGain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;