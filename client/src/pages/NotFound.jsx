import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.emoji}>🦜</div>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Бет табылмады!</h2>
        <p style={styles.sub}>The page you are looking for does not exist.</p>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/login')}>
          Go Home →
        </button>
      </div>
    </div>
  )
}

const styles = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' },
  card:  { textAlign: 'center', padding: '48px 40px', background: '#fff', borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(124,58,237,0.08)', maxWidth: 420 },
  emoji: { fontSize: 72, marginBottom: 16 },
  code:  { fontSize: 80, fontWeight: 900, color: '#7C3AED', marginBottom: 8, lineHeight: 1 },
  title: { fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 },
  sub:   { fontSize: 15, color: '#94A3B8', fontWeight: 600 },
}