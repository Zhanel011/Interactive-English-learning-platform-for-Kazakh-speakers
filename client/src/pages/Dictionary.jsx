import { useState, useEffect, useCallback } from 'react'
import api from '../api.js'

const CATEGORIES = ['all', 'greetings', 'food', 'objects', 'transport', 'city', 'abstract']

export default function Dictionary() {
  const [words,      setWords]      = useState([])
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('all')
  const [loading,    setLoading]    = useState(true)
  const [learnedIds, setLearnedIds] = useState(new Set())
  const [toast,      setToast]      = useState('')

  const fetchWords = useCallback(() => {
    const params = {}
    if (search)             params.search   = search
    if (category !== 'all') params.category = category
    api.get('/words', { params })
      .then(r => {
        setWords(r.data)
        setLearnedIds(new Set(r.data.filter(w => w.learned).map(w => w.id)))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, category])

  useEffect(() => { fetchWords() }, [fetchWords])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleLearn = async (id) => {
    try {
      await api.post(`/words/${id}/learn`)
      setLearnedIds(s => new Set([...s, id]))
      showToast('✅ Сөз үйренілді! Word learned!')
    } catch {
      showToast('❌ Қате пайда болды!')
    }
  }

  return (
    <div>
      {toast && (
        <div style={styles.toast}>{toast}</div>
      )}

      <h1 className="page-title">My Dictionary</h1>
      <p className="page-sub">{words.length} words · {learnedIds.size} learned</p>

      <input
        style={styles.search}
        placeholder="🔍  Search in English or Kazakh..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.filters}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            style={{ ...styles.filterBtn, ...(category === c ? styles.filterActive : {}) }}
            onClick={() => setCategory(c)}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, fontSize: 32 }}>🦜</div>
      ) : words.length === 0 ? (
        <div style={styles.empty}>No words found 🔍</div>
      ) : (
        words.map(word => (
          <div key={word.id} style={styles.wordCard}>
            <span style={styles.wordIcon}>{word.icon || '📝'}</span>
            <div style={{ flex: 1 }}>
              <div style={styles.wordEng}>{word.english}</div>
              <div style={styles.wordKz}>{word.kazakh}</div>
            </div>
            <span className={`level-badge level-${word.level.toLowerCase()}`}>{word.level}</span>
            <button
              style={{ ...styles.learnBtn, ...(learnedIds.has(word.id) ? styles.learnedBtn : {}) }}
              onClick={() => !learnedIds.has(word.id) && handleLearn(word.id)}
            >
              {learnedIds.has(word.id) ? '✅' : '+ Learn'}
            </button>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  toast:       { position: 'fixed', top: 20, right: 20, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 14, zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
  search:      { width: '100%', padding: '14px 18px', border: '2px solid #E2E8F0', borderRadius: 16, fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, outline: 'none', marginBottom: 16, background: '#fff' },
  filters:     { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  filterBtn:   { padding: '8px 16px', border: '2px solid #E2E8F0', borderRadius: 99, background: '#fff', fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#94A3B8' },
  filterActive:{ background: '#EDE9FE', borderColor: '#7C3AED', color: '#7C3AED' },
  wordCard:    { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '16px 18px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  wordIcon:    { fontSize: 26, width: 40, textAlign: 'center' },
  wordEng:     { fontSize: 16, fontWeight: 800, color: '#0F172A' },
  wordKz:      { fontSize: 13, color: '#94A3B8', fontWeight: 600 },
  learnBtn:    { padding: '8px 16px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none', borderRadius: 12, fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' },
  learnedBtn:  { background: '#EDE9FE', color: '#7C3AED', cursor: 'default' },
  empty:       { textAlign: 'center', padding: '40px 0', fontSize: 16, color: '#94A3B8', fontWeight: 700 },
}

