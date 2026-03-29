import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/lessons')
      .then(r => setLessons(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>

  // Урок доступен если предыдущий пройден ИЛИ сам уже пройден
  const isUnlocked = (lesson, idx) => {
    if (idx === 0) return true
    if (lesson.completed) return true
    return lessons[idx - 1]?.completed
  }

  return (
    <div>
      <h1 className="page-title">Lessons</h1>
      <p className="page-sub">Choose a topic to practice</p>

      <div style={styles.grid}>
        {lessons.map((lesson, idx) => {
          const unlocked = isUnlocked(lesson, idx)
          return (
            <div
              key={lesson.id}
              style={{
                ...styles.card,
                background: lesson.completed ? 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' : '#fff',
                borderColor: lesson.completed ? '#C4B5FD' : '#E2E8F0',
                opacity: unlocked ? 1 : 0.5,
                cursor: unlocked ? 'pointer' : 'not-allowed',
              }}
              onClick={() => unlocked && navigate(`/home/quiz/${lesson.id}`)}
            >
              <div style={styles.cardTop}>
                <span style={styles.icon}>{lesson.icon}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {lesson.completed && <span style={styles.completedBadge}>✓ Done</span>}
                  {!unlocked && <span>🔒</span>}
                </div>
              </div>
              <div style={{ ...styles.cardTitle, color: lesson.completed ? '#7C3AED' : '#0F172A' }}>
                {lesson.title}
              </div>
              <div style={styles.cardSub}>{lesson.total_exercises} exercises · {lesson.level}</div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: lesson.completed ? '100%' : lesson.user_score > 0 ? `${lesson.user_score}%` : '0%',
                  background: lesson.completed ? 'linear-gradient(90deg, #7C3AED, #A855F7)' : '#10B981'
                }} />
              </div>
              {lesson.user_score > 0 && (
                <div style={{ ...styles.scoreLabel, color: lesson.completed ? '#7C3AED' : '#10B981' }}>
                  Best score: {lesson.user_score}%
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  grid:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:         { borderRadius: 20, border: '2px solid', padding: '20px', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  icon:         { fontSize: 36 },
  completedBadge: { background: '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99 },
  cardTitle:    { fontSize: 16, fontWeight: 900, marginBottom: 4 },
  cardSub:      { fontSize: 12, color: '#94A3B8', fontWeight: 700, marginBottom: 14 },
  progressBar:  { height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, transition: 'width 0.5s' },
  scoreLabel:   { fontSize: 12, fontWeight: 800, marginTop: 8 },
}
