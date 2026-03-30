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
    // Текущий статус урока
    const current = await pool.query(
      'SELECT completed, score FROM user_lesson_progress WHERE user_id=$1 AND lesson_id=$2',
      [userId, lessonId]
    );

    const wasCompleted = current.rows[0]?.completed || false
    const bestScore    = current.rows[0]?.score || 0
    const newCompleted = wasCompleted || score >= 60
    const newScore     = Math.max(bestScore, score)

    // Прогресс сақтау
    await pool.query(`
      INSERT INTO user_lesson_progress (user_id, lesson_id, completed, score, attempts, completed_at)
      VALUES ($1, $2, $3, $4, 1, NOW())
      ON CONFLICT (user_id, lesson_id) DO UPDATE
        SET completed    = $3,
            score        = $4,
            attempts     = user_lesson_progress.attempts + 1,
            completed_at = CASE WHEN $3 THEN COALESCE(user_lesson_progress.completed_at, NOW()) ELSE user_lesson_progress.completed_at END
    `, [userId, lessonId, newCompleted, newScore]);

    // XP беру
    const xpGain = Math.round(score / 2);
    await pool.query('UPDATE users SET xp = xp + $1 WHERE id = $2', [xpGain, userId]);

    // Деңгейді автоматты көтеру
    const a1Res = await pool.query(`
      SELECT COUNT(DISTINCT l.id) as count 
      FROM user_lesson_progress ulp
      JOIN lessons l ON l.id = ulp.lesson_id
      WHERE ulp.user_id = $1 AND ulp.completed = true AND l.level = 'A1'
    `, [userId]);

    const a1Done = parseInt(a1Res.rows[0].count);
    if (a1Done >= 4) {
      const userRes = await pool.query('SELECT level FROM users WHERE id=$1', [userId]);
      if (userRes.rows[0].level === 'A1') {
        await pool.query('UPDATE users SET level=$1 WHERE id=$2', ['A2', userId]);
      }
    }

    const a2Res = await pool.query(`
      SELECT COUNT(DISTINCT l.id) as count 
      FROM user_lesson_progress ulp
      JOIN lessons l ON l.id = ulp.lesson_id
      WHERE ulp.user_id = $1 AND ulp.completed = true AND l.level = 'A2'
    `, [userId]);

    const a2Done = parseInt(a2Res.rows[0].count);
    if (a2Done >= 4) {
      const userRes = await pool.query('SELECT level FROM users WHERE id=$1', [userId]);
      if (userRes.rows[0].level === 'A2') {
        await pool.query('UPDATE users SET level=$1 WHERE id=$2', ['B1', userId]);
      }
    }

    res.json({ success: true, xp_gained: xpGain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;