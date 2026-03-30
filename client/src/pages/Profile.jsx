import { useState, useEffect, useRef } from 'react'
import api from '../api.js'

const BADGES = [
  { icon: '⚡', name: 'First Lesson',  req: (p) => p.lessons_completed >= 1 },
  { icon: '📚', name: '10 Lessons',    req: (p) => p.lessons_completed >= 10 },
  { icon: '📖', name: '10 Words',      req: (p) => p.words_learned >= 10 },
  { icon: '🌟', name: '500 XP',        req: (p) => p.xp >= 500 },
  { icon: '🎯', name: 'All Lessons',   req: (p) => p.lessons_completed >= 6 },
  { icon: '💎', name: '1000 XP',       req: (p) => p.xp >= 1000 },
  { icon: '🏅', name: '5 Lessons',     req: (p) => p.lessons_completed >= 5 },
  { icon: '📝', name: '5 Words',       req: (p) => p.words_learned >= 5 },
]

export default function Profile() {
  const [profile,    setProfile]    = useState(null)
  const [editing,    setEditing]    = useState(false)
  const [newName,    setNewName]    = useState('')
  const [toast,      setToast]      = useState('')
  const [uploading,  setUploading]  = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    api.get('/users/profile')
      .then(r => setProfile(r.data))
      .catch(console.error)
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = async () => {
    if (!newName.trim()) return
    try {
      await api.patch('/users/profile', { name: newName })
      setProfile(p => ({ ...p, name: newName }))
      setEditing(false)
      showToast('✅ Аты сәтті өзгертілді!')
    } catch {
      showToast('❌ Қате болды!')
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('❌ Файл тым үлкен! Максимум 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const { data } = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setProfile(p => ({ ...p, avatar: data.avatarUrl }))
      showToast('✅ Аватар жаңартылды!')
    } catch {
      showToast('❌ Жүктеу қатесі!')
    } finally {
      setUploading(false)
    }
  }

  const isImageUrl = (str) => str && str.startsWith('/uploads/')

  if (!profile) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>

  const earned = BADGES.filter(b => b.req(profile))
  const locked = BADGES.filter(b => !b.req(profile))

  return (
    <div>
      {toast && <div style={styles.toast}>{toast}</div>}

      <h1 className="page-title">Profile</h1>
      <p className="page-sub">Your learning stats</p>

      {/* Profile header */}
      <div className="card" style={styles.profileHeader}>
        {/* Avatar */}
        <div style={styles.avatarWrap} onClick={handleAvatarClick}>
          {isImageUrl(profile.avatar) ? (
            <img
              src={`http://localhost:3001${profile.avatar}`}
              alt="avatar"
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.avatarEmoji}>{profile.avatar || '🦜'}</div>
          )}
          <div style={styles.avatarOverlay}>
            {uploading ? '⏳' : '📷'}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <p style={styles.avatarHint}>Click to change photo</p>

        {/* Name */}
        {editing ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <input style={styles.nameInput} value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
            <button style={styles.saveBtn} onClick={handleSave}>Save</button>
            <button style={styles.cancelBtn} onClick={() => setEditing(false)}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
            <div style={styles.profileName}>{profile.name}</div>
            <button style={styles.editBtn} onClick={() => { setNewName(profile.name); setEditing(true) }}>✏️</button>
          </div>
        )}
        <div style={styles.profileLevel}>
          <span className={`level-badge level-${profile.level?.toLowerCase()}`}>{profile.level}</span>
          &nbsp;·&nbsp; Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { val: profile.xp,                label: 'Total XP',      color: '#7C3AED', icon: '⚡' },
          { val: profile.lessons_completed,  label: 'Lessons Done',  color: '#10B981', icon: '📚' },
          { val: profile.words_learned,      label: 'Words Learned', color: '#0D9488', icon: '📖' },
        ].map(s => (
          <div key={s.label} className="card" style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={styles.sectionRow}>
        <span style={styles.sectionTitle}>🏆 Achievements</span>
        <span style={styles.sectionSub}>{earned.length}/{BADGES.length} earned</span>
      </div>
      <div style={styles.badgeGrid}>
        {earned.map(b => (
          <div key={b.name} style={styles.badge}>
            <div style={styles.badgeIcon}>{b.icon}</div>
            <div style={styles.badgeName}>{b.name}</div>
          </div>
        ))}
        {locked.map(b => (
          <div key={b.name} style={{ ...styles.badge, opacity: 0.25, filter: 'grayscale(1)' }}>
            <div style={styles.badgeIcon}>{b.icon}</div>
            <div style={styles.badgeName}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  toast:        { position: 'fixed', top: 20, right: 20, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 14, zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
  profileHeader:{ textAlign: 'center', marginBottom: 20, padding: '32px 20px', background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' },
  avatarWrap:   { position: 'relative', width: 100, height: 100, margin: '0 auto 8px', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden' },
  avatarImg:    { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7C3AED' },
  avatarEmoji:  { width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, border: '3px solid #7C3AED' },
  avatarOverlay:{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(124,58,237,0.7)', color: '#fff', textAlign: 'center', padding: '4px', fontSize: 16 },
  avatarHint:   { fontSize: 12, color: '#94A3B8', marginBottom: 12 },
  profileName:  { fontSize: 24, fontWeight: 900, color: '#0F172A' },
  profileLevel: { fontSize: 13, color: '#94A3B8', fontWeight: 600, marginTop: 8 },
  editBtn:      { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 },
  nameInput:    { padding: '10px 14px', border: '2px solid #7C3AED', borderRadius: 12, fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, outline: 'none' },
  saveBtn:      { padding: '10px 16px', background: '#7C3AED', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, cursor: 'pointer' },
  cancelBtn:    { padding: '10px 12px', background: '#E2E8F0', border: 'none', borderRadius: 12, fontFamily: 'Outfit, sans-serif', fontWeight: 800, cursor: 'pointer' },
  statsGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 },
  statCard:     { textAlign: 'center', padding: '20px 12px' },
  statIcon:     { fontSize: 28, marginBottom: 8 },
  statLabel:    { fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 6 },
  sectionRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 800, color: '#0F172A' },
  sectionSub:   { fontSize: 13, fontWeight: 700, color: '#94A3B8' },
  badgeGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  badge:        { background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '16px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  badgeIcon:    { fontSize: 28, marginBottom: 8 },
  badgeName:    { fontSize: 10, fontWeight: 800, color: '#94A3B8' },
}