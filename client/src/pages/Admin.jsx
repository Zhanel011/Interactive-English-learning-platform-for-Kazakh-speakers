import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Admin() {
  const { user }            = useAuth()
  const navigate            = useNavigate()
  const [users,   setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return }
    fetchUsers()
  }, [user])

  const fetchUsers = () => {
    api.get('/users/all')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(u => u.filter(x => x.id !== id))
      showToast('✅ Пайдаланушы жойылды!')
    } catch {
      showToast('❌ Қате болды!')
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>

  const students = users.filter(u => u.role !== 'admin')

  return (
    <div>
      {toast && <div style={styles.toast}>{toast}</div>}

      <h1 className="page-title">⚙️ Admin Panel</h1>
      <p className="page-sub">Барлық студенттердің статистикасы</p>

      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#7C3AED' }}>{students.length}</div>
          <div style={styles.statLabel}>Студенттер саны</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#A855F7' }}>
            {students.reduce((s, u) => s + Number(u.xp), 0).toLocaleString()}
          </div>
          <div style={styles.statLabel}>Жалпы XP</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#0D9488' }}>
            {students.reduce((s, u) => s + Number(u.lessons_completed), 0)}
          </div>
          <div style={styles.statLabel}>Өткен сабақтар</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>
            {students.reduce((s, u) => s + Number(u.words_learned), 0)}
          </div>
          <div style={styles.statLabel}>Үйренген сөздер</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20, padding: 0, overflow: 'hidden' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Студент</th>
              <th style={styles.th}>Деңгей</th>
              <th style={styles.th}>XP</th>
              <th style={styles.th}>Streak</th>
              <th style={styles.th}>Сабақтар</th>
              <th style={styles.th}>Сөздер</th>
              <th style={styles.th}>Тіркелген күн</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {students.map((u, i) => (
              <tr key={u.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#F8F7FF' }}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatarWrap}>
                      {u.avatar && u.avatar.startsWith('/uploads/') ? (
                        <img src={`https://interactive-english-learning-platform.onrender.com${u.avatar}`} alt="avatar" style={styles.avatarImg} />
                      ) : (
                        <span style={{ fontSize: 22 }}>{u.avatar || '🦜'}</span>
                      )}
                    </div>
                    <div>
                      <div style={styles.userName}>{u.name}</div>
                      <div style={styles.userEmail}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span className={`level-badge level-${u.level?.toLowerCase()}`}>{u.level}</span>
                </td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#7C3AED' }}>{Number(u.xp).toLocaleString()}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#F59E0B' }}>🔥 {u.streak}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#0D9488' }}>{u.lessons_completed}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#3B82F6' }}>{u.words_learned}</td>
                <td style={{ ...styles.td, color: '#94A3B8' }}>
                  {new Date(u.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(u.id, u.name)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  statsGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 },
  statCard:   { textAlign: 'center', padding: '18px 12px' },
  statLabel:  { fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 },
  table:      { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#F8F7FF' },
  th:         { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr:         { borderBottom: '1px solid #E2E8F0' },
  td:         { padding: '12px 16px', fontSize: 14 },
  userCell:   { display: 'flex', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#EDE9FE' },
  avatarImg:  { width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' },
  userName:   { fontWeight: 800, color: '#0F172A', fontSize: 14 },
  userEmail:  { fontSize: 12, color: '#94A3B8', fontWeight: 600 },
  deleteBtn:  { background: '#FEE2E2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },
  toast:      { position: 'fixed', top: 20, right: 20, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, zIndex: 999 },
}