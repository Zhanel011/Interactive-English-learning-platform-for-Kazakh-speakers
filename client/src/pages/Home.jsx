import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api.js'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/lessons')
      .then(r => setLessons(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const dailyXP = user?.xp % 100 || 0
  const xpPct   = Math.min((dailyXP / 100) * 100, 100)

  const getBubbleState = (lesson, idx) => {
    if (lesson.completed) return 'done'
    const prevDone = idx === 0 || lessons[idx - 1]?.completed
    if (prevDone) return 'current'
    return 'locked'
  }

  const cardColors = [
    { bg: 'linear-gradient(135deg, #7C3AED, #A855F7)', shadow: 'rgba(124,58,237,0.3)' },
    { bg: 'linear-gradient(135deg, #0D9488, #14B8A6)', shadow: 'rgba(13,148,136,0.3)' },
    { bg: 'linear-gradient(135deg, #F59E0B, #FCD34D)', shadow: 'rgba(245,158,11,0.3)' },
    { bg: 'linear-gradient(135deg, #EC4899, #F472B6)', shadow: 'rgba(236,72,153,0.3)' },
    { bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)', shadow: 'rgba(59,130,246,0.3)' },
    { bg: 'linear-gradient(135deg, #10B981, #34D399)', shadow: 'rgba(16,185,129,0.3)' },
    { bg: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)', shadow: 'rgba(139,92,246,0.3)' },
    { bg: 'linear-gradient(135deg, #EF4444, #F87171)', shadow: 'rgba(239,68,68,0.3)' },
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>

  return (
    <div>
      <h1 className="page-title">Сәлем, {user?.name?.split(' ')[0]}! 👋</h1>
      <p className="page-sub">Continue your English journey</p>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statVal}>{user?.streak ?? 0}</div>
          <div style={styles.statLabel}>Streak</div>
        </div>
        <div style={{ ...styles.statCard, flex: 2, padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Daily XP</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>{dailyXP} / 100</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚡</div>
          <div style={styles.statVal}>{user?.xp ?? 0}</div>
          <div style={styles.statLabel}>Total XP</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statVal}>{lessons.filter(l => l.completed).length}/{lessons.length}</div>
          <div style={styles.statLabel}>Lessons</div>
        </div>
      </div>

      {/* Unit badge */}
      <div style={styles.unitRow}>
        <div style={styles.unitBadge}>📚 Unit 1 — Basics & Kazakh Culture</div>
      </div>

      {/* Lesson cards grid */}
      <div style={styles.grid}>
        {lessons.map((lesson, i) => {
          const state  = getBubbleState(lesson, i)
          const color  = cardColors[i % cardColors.length]
          const locked = state === 'locked'
          return (
            <div
              key={lesson.id}
              style={{
                ...styles.lessonCard,
                background: locked ? '#F1F5F9' : color.bg,
                boxShadow: locked ? 'none' : `0 8px 24px ${color.shadow}`,
                opacity: locked ? 0.6 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !locked && navigate(`/home/quiz/${lesson.id}`)}
            >
              <div style={styles.cardIcon}>{locked ? '🔒' : lesson.icon}</div>
              <div style={{ ...styles.cardTitle, color: locked ? '#94A3B8' : '#fff' }}>
                {lesson.title}
              </div>
              <div style={{ ...styles.cardSub, color: locked ? '#CBD5E1' : 'rgba(255,255,255,0.8)' }}>
                {lesson.total_exercises} exercises · {lesson.level}
              </div>
              {state === 'done' && (
                <div style={styles.doneBadge}>✓ Completed</div>
              )}
              {state === 'current' && (
                <div style={styles.startBadge}>Start →</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  statsRow:   { display: 'flex', gap: 12, marginBottom: 28, alignItems: 'stretch' },
  statCard:   { background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '16px', textAlign: 'center', flex: 1, boxShadow: '0 2px 8px rgba(124,58,237,0.06)' },
  statIcon:   { fontSize: 24, marginBottom: 4 },
  statVal:    { fontSize: 22, fontWeight: 900, color: '#0F172A' },
  statLabel:  { fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 },
  unitRow:    { marginBottom: 20 },
  unitBadge:  { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #EDE9FE, #F3E8FF)', color: '#7C3AED', padding: '10px 20px', borderRadius: 99, fontSize: 14, fontWeight: 800, border: '1px solid #DDD6FE' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  lessonCard: { borderRadius: 20, padding: '24px 20px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' },
  cardIcon:   { fontSize: 36, marginBottom: 12 },
  cardTitle:  { fontSize: 16, fontWeight: 800, marginBottom: 6 },
  cardSub:    { fontSize: 12, fontWeight: 600, marginBottom: 16 },
  doneBadge:  { display: 'inline-block', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800 },
  startBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.9)', color: '#7C3AED', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800 },
}