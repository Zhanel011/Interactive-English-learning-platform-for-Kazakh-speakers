import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Валидация
    if (form.name.trim().length < 2)
      return setError('Аты кем дегенде 2 символ болуы керек')
    if (!form.email.includes('@') || !form.email.includes('.'))
      return setError('Email дұрыс емес, @ және . болуы керек')
    if (form.password.length < 6)
      return setError('Пароль минимум 6 символ болуы керек')
    if (form.password !== form.confirm)
      return setError('Парольдер сәйкес келмейді')

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Тіркелу қатесі')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🦜</div>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.sub}>Start your English journey today</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="input-group">
            <label className="input-label">Your name</label>
            <input
              className="input-field"
              type="text"
              name="name"
              placeholder="Айгерим"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
            {/* Подсказка в реальном времени */}
            {form.email && !form.email.includes('@') && (
              <div style={styles.hint}>⚠️ Email должен содержать @</div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Минимум 6 символ"
              value={form.password}
              onChange={handleChange}
              required
            />
            {/* Индикатор силы пароля */}
            {form.password && (
              <div style={styles.strengthWrap}>
                <div style={{
                  ...styles.strengthBar,
                  width: form.password.length >= 10 ? '100%' : form.password.length >= 6 ? '60%' : '30%',
                  background: form.password.length >= 10 ? '#58CC02' : form.password.length >= 6 ? '#FF9600' : '#FF4B4B'
                }}/>
                <span style={styles.strengthLabel}>
                  {form.password.length >= 10 ? '💪 Күшті' : form.password.length >= 6 ? '👍 Жақсы' : '⚠️ Әлсіз'}
                </span>
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Confirm password</label>
            <input
              className="input-field"
              type="password"
              name="confirm"
              placeholder="Парольді қайталаңыз"
              value={form.confirm}
              onChange={handleChange}
              required
            />
            {form.confirm && form.confirm !== form.password && (
              <div style={styles.hint}>⚠️ Парольдер сәйкес келмейді</div>
            )}
            {form.confirm && form.confirm === form.password && form.password.length >= 6 && (
              <div style={{ ...styles.hint, color: '#58CC02' }}>✅ Парольдер сәйкес келеді</div>
            )}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Жүктелуде...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:          { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F7F7', padding: '24px' },
  card:          { background: '#fff', borderRadius: 24, border: '2px solid #E5E5E5', padding: '36px 32px', width: '100%', maxWidth: 420 },
  logo:          { fontSize: 52, textAlign: 'center', marginBottom: 8 },
  title:         { fontSize: 26, fontWeight: 900, textAlign: 'center', color: '#1f1f1f', marginBottom: 4 },
  sub:           { fontSize: 14, color: '#AFAFAF', textAlign: 'center', fontWeight: 600, marginBottom: 24 },
  hint:          { fontSize: 12, color: '#FF4B4B', fontWeight: 700, marginTop: 6 },
  strengthWrap:  { display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 },
  strengthBar:   { height: 6, borderRadius: 99, transition: 'width 0.3s, background 0.3s' },
  strengthLabel: { fontSize: 12, fontWeight: 700, color: '#AFAFAF' },
  switchText:    { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#AFAFAF', fontWeight: 600 },
  link:          { color: '#1CB0F6', fontWeight: 800, textDecoration: 'none' },
}