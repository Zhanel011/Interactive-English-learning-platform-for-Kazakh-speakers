import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api.js'

export default function Quiz() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { setUser } = useAuth()

  const [exercises, setExercises] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [answered,  setAnswered]  = useState(false)
  const [hearts,    setHearts]    = useState(3)
  const [correct,   setCorrect]   = useState(0)
  const [finished,  setFinished]  = useState(false)
  const [xpGained,  setXpGained]  = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [shuffled,  setShuffled]  = useState([])

  // Ref для точного отслеживания жизней
  const heartsRef  = useRef(3)
  const correctRef = useRef(0)

  useEffect(() => {
    api.get(`/lessons/${id}/exercises`)
      .then(r => {
        setExercises(r.data)
        setLoading(false)
        if (r.data[0]) setShuffled([...r.data[0].options].sort(() => Math.random() - 0.5))
      })
      .catch(console.error)
  }, [id])

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    const ex = exercises[current]
    if (opt === ex.correct_answer) {
      correctRef.current += 1
      setCorrect(correctRef.current)
    } else {
      heartsRef.current -= 1
      setHearts(heartsRef.current)
    }
  }

  const handleNext = async () => {
    const nextIdx = current + 1
    const noLives = heartsRef.current <= 0
    const lastQ   = nextIdx >= exercises.length

    if (noLives || lastQ) {
      const score = Math.round((correctRef.current / exercises.length) * 100)
      try {
        const res = await api.post(`/lessons/${id}/complete`, { score })
        setXpGained(res.data.xp_gained)
        const me = await api.get('/auth/me')
        setUser(me.data)
      } catch {}
      setFinished(true)
    } else {
      setCurrent(nextIdx)
      setSelected(null)
      setAnswered(false)
      setShuffled([...exercises[nextIdx].options].sort(() => Math.random() - 0.5))
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 36 }}>🦜</div>
  if (!exercises.length) return <div style={{ padding: 40 }}>No exercises found.</div>

  const ex        = exercises[current]
  const progress  = (current / exercises.length) * 100
  const isCorrect = selected === ex?.correct_answer

  if (finished) {
    const score  = Math.round((correctRef.current / exercises.length) * 100)
    const passed = score >= 60
    return (
      <div style={{ textAlign: 'center', paddingTop: 40 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>{passed ? '🎉' : '😢'}</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          {passed ? 'Lesson Complete!' : 'Try Again!'}
        </h2>
        <p style={{ color: '#AFAFAF', fontWeight: 700, marginBottom: 32 }}>
          {passed
            ? `You scored ${score}% — great job!`
            : `You scored ${score}%. You need 60% to pass.`}
        </p>
        <div style={styles.resultGrid}>
          <div style={styles.resultCard}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#58CC02' }}>{correctRef.current}/{exercises.length}</div>
            <div style={styles.resultLabel}>Correct</div>
          </div>
          <div style={styles.resultCard}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#FF9600' }}>+{xpGained}</div>
            <div style={styles.resultLabel}>XP Earned</div>
          </div>
          <div style={styles.resultCard}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#CE82FF' }}>
              {'❤️'.repeat(Math.max(0, heartsRef.current))}
              {'🖤'.repeat(Math.max(0, 3 - heartsRef.current))}
            </div>
            <div style={styles.resultLabel}>Lives left</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/home/lessons')}>Back</button>
          <button className="btn btn-primary"   style={{ flex: 1 }} onClick={() => navigate('/home')}>Continue →</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.closeBtn} onClick={() => navigate('/home/lessons')}>✕</button>
        <div style={{ flex: 1 }}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
        <div style={styles.hearts}>
          {'❤️'.repeat(Math.max(0, hearts))}
          {'🖤'.repeat(Math.max(0, 3 - hearts))}
        </div>
      </div>

      <div className="card" style={styles.questionCard}>
        <div style={styles.qType}>
          {ex.type === 'translate' ? 'Translate to English' : 'Choose the correct answer'}
        </div>
        <div style={styles.qText}>{ex.question}</div>
        {ex.question_sub && <div style={styles.qSub}>{ex.question_sub}</div>}
      </div>

      <div style={styles.options}>
        {shuffled.map(opt => {
          let cls = 'quiz-opt'
          if (answered) {
            if (opt === ex.correct_answer) cls += ' correct'
            else if (opt === selected)     cls += ' wrong'
          }
          return (
            <button key={opt} className={cls} onClick={() => handleSelect(opt)} disabled={answered}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? '✅ Correct! Well done!' : `❌ Correct answer: ${ex.correct_answer}`}
        </div>
      )}

      {answered && (
        <button className="btn btn-primary" onClick={handleNext} style={{ marginTop: 8 }}>
          {current + 1 >= exercises.length ? 'See Results →' : 'Continue →'}
        </button>
      )}
    </div>
  )
}

const styles = {
  header:       { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  closeBtn:     { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#AFAFAF', fontWeight: 900, padding: '4px 8px' },
  progressBar:  { height: 14, background: '#E5E5E5', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#58CC02', borderRadius: 99, transition: 'width 0.4s ease' },
  hearts:       { fontSize: 18, letterSpacing: 2 },
  questionCard: { textAlign: 'center', marginBottom: 20, padding: '28px 24px' },
  qType:        { fontSize: 12, fontWeight: 800, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 },
  qText:        { fontSize: 26, fontWeight: 900, color: '#1f1f1f' },
  qSub:         { fontSize: 14, color: '#AFAFAF', fontWeight: 600, marginTop: 8 },
  options:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  resultGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  resultCard:   { background: '#fff', borderRadius: 16, border: '2px solid #E5E5E5', padding: '20px 12px' },
  resultLabel:  { fontSize: 11, fontWeight: 800, color: '#AFAFAF', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 },
}
