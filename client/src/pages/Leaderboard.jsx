import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api.js'

const BACKEND = 'https://interactive-english-learning-platform.onrender.com'

export default function Leaderboard() {
  const { user }              = useAuth()
  const [board,   setBoard]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(r => setBoard(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getStatus = (rank) => {
    if (rank === 1) return { label: '⭐ Top Learner', bg: '#FEF3C7', color: '#D97706' }
    if (rank === 2) return { label: '🚀 Rising Star', bg: '#EDE9FE', color: '#7C3AED' }
    if (rank === 3) return { label: '🔥 On Fire',     bg: '#FCE7F3', color: '#EC4899' }
    return null
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>

  return (
    <div>
      <h1 className="page-title">Leaderboard</h1>
      <p className="page-sub">Top learners this week 🏆</p>

      {board.map((u) => {
        const isMe   = u.id === user?.id
        const rank   = Number(u.rank)
        const status = getStatus(rank)
        return (
          <div key={u.id} style={{
            ...styles.row,
            background: isMe ? 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' : '#fff',
            border: isMe ? '2px solid #7C3AED' : '1px solid #E2E8F0',
          }}>
            <div style={styles.rank}>{rankIcon(rank)}</div>
            <div style={styles.avatarWrap}>
              {u.avatar && u.avatar.startsWith('/uploads/') ? (
                <img src={`${BACKEND}${u.avatar}`} alt="avatar" style={styles.avatarImg} />
              ) : (
                <span style={{ fontSize: 30 }}>{u.avatar || '🦜'}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.nameRow}>
                <span style={styles.name}>{u.name}</span>
                {isMe && <span style={styles.youBadge}>You</span>}
                {status && (
                  <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                )}
              </div>
              <div style={styles.meta}>
                <span className={`level-badge level-${u.level?.toLowerCase()}`}>{u.level}</span>
              </div>
            </div>
            <div style={styles.xpWrap}>
              <div style={styles.xpVal}>{Number(u.xp).toLocaleString()}</div>
              <div style={styles.xpLabel}>XP</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  row:         { display: 'flex', alignItems: 'center', gap: 16, borderRadius: 18, padding: '16px 20px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' },
  rank:        { fontSize: 24, fontWeight: 900, width: 40, textAlign: 'center' },
  avatarWrap:  { width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarImg:   { width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' },
  nameRow:     { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  name:        { fontSize: 16, fontWeight: 800, color: '#0F172A' },
  youBadge:    { background: '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 99 },
  statusBadge: { fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99 },
  meta:        { display: 'flex', alignItems: 'center', gap: 8 },
  xpWrap:      { textAlign: 'right' },
  xpVal:       { fontSize: 22, fontWeight: 900, color: '#7C3AED' },
  xpLabel:     { fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' },
}