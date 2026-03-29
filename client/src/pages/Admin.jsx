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

  // Тек studentтар
  const students = users.filter(u => u.role !== 'admin')

  return (
    <div>
      {toast && <div style={styles.toast}>{toast}</div>}

      <h1 className="page-title">⚙️ Admin Panel</h1>
      <p className="page-sub">Барлық студенттердің статистикасы</p>

      {/* Жалпы статистика */}
      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#58CC02' }}>{students.length}</div>
          <div style={styles.statLabel}>Студенттер саны</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#CE82FF' }}>
            {students.reduce((s, u) => s + Number(u.xp), 0).toLocaleString()}
          </div>
          <div style={styles.statLabel}>Жалпы XP</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1CB0F6' }}>
            {students.reduce((s, u) => s + Number(u.lessons_completed), 0)}
          </div>
          <div style={styles.statLabel}>Өткен сабақтар</div>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FF9600' }}>
            {students.reduce((s, u) => s + Number(u.words_learned), 0)}
          </div>
          <div style={styles.statLabel}>Үйренген сөздер</div>
        </div>
      </div>

      {/* Студенттер кестесі */}
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
              <tr key={u.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#F7F7F7' }}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <span style={styles.avatar}>{u.avatar || '🦜'}</span>
                    <div>
                      <div style={styles.userName}>{u.name}</div>
                      <div style={styles.userEmail}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span className={`level-badge level-${u.level?.toLowerCase()}`}>{u.level}</span>
                </td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#CE82FF' }}>{Number(u.xp).toLocaleString()}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#FF9600' }}>🔥 {u.streak}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#58CC02' }}>{u.lessons_completed}</td>
                <td style={{ ...styles.td, fontWeight: 900, color: '#1CB0F6' }}>{u.words_learned}</td>
                <td style={{ ...styles.td, color: '#AFAFAF' }}>
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
  statLabel:  { fontSize: 11, fontWeight: 800, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 },
  table:      { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#F7F7F7' },
  th:         { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr:         { borderBottom: '1px solid #E5E5E5' },
  td:         { padding: '12px 16px', fontSize: 14 },
  userCell:   { display: 'flex', alignItems: 'center', gap: 10 },
  avatar:     { fontSize: 24 },
  userName:   { fontWeight: 800, color: '#1f1f1f', fontSize: 14 },
  userEmail:  { fontSize: 12, color: '#AFAFAF', fontWeight: 600 },
  deleteBtn:  { background: '#FFEAEA', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },
  toast:      { position: 'fixed', top: 20, right: 20, background: '#1f1f1f', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, zIndex: 999 },
}