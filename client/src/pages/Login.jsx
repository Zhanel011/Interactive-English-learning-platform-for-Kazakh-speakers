import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.includes('@')) return setError('Email должен содержать @')
    if (form.password.length < 6)  return setError('Пароль минимум 6 символов')

    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      // Роль бойынша бағыттау
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Логин немесе пароль қате')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🦜</div>
        <h1 style={styles.title}>LinguaFlow</h1>
        <p style={styles.sub}>Learn English every day</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input-field"
              type="text"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Жүктелуде...' : 'LOG IN'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:      { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F7F7', padding: '24px' },
  card:      { background: '#fff', borderRadius: 24, border: '2px solid #E5E5E5', padding: '36px 32px', width: '100%', maxWidth: 420 },
  logo:      { fontSize: 52, textAlign: 'center', marginBottom: 8 },
  title:     { fontSize: 28, fontWeight: 900, textAlign: 'center', color: '#58CC02', marginBottom: 4 },
  sub:       { fontSize: 14, color: '#AFAFAF', textAlign: 'center', fontWeight: 600, marginBottom: 24 },
  switchText:{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#AFAFAF', fontWeight: 600 },
  link:      { color: '#1CB0F6', fontWeight: 800, textDecoration: 'none' },
}