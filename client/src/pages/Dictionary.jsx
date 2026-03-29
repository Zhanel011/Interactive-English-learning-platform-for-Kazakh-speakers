import { useState, useEffect, useCallback } from 'react'
import api from '../api.js'

const CATEGORIES = ['all', 'greetings', 'food', 'objects', 'transport', 'city', 'abstract']

export default function Dictionary() {
  const [words,      setWords]      = useState([])
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('all')
  const [loading,    setLoading]    = useState(true)
  const [learnedIds, setLearnedIds] = useState(new Set())

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

  const handleLearn = async (id) => {
    try {
      await api.post(`/words/${id}/learn`)
      setLearnedIds(s => new Set([...s, id]))
    } catch {}
  }

  return (
    <div>
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
              <div style={styles.wordKz}>{word.kazakh} · {word.russian}</div>
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
  search:      { width: '100%', padding: '12px 16px', border: '2.5px solid #E5E5E5', borderRadius: 14, fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, outline: 'none', marginBottom: 16, background: '#fff' },
  filters:     { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  filterBtn:   { padding: '6px 14px', border: '2px solid #E5E5E5', borderRadius: 99, background: '#fff', fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 800, cursor: 'pointer', color: '#AFAFAF' },
  filterActive:{ background: '#D7F5C3', borderColor: '#58CC02', color: '#46A302' },
  wordCard:    { display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 14, border: '2px solid #E5E5E5', padding: '14px 16px', marginBottom: 10 },
  wordIcon:    { fontSize: 24, width: 36, textAlign: 'center' },
  wordEng:     { fontSize: 16, fontWeight: 800, color: '#1f1f1f' },
  wordKz:      { fontSize: 13, color: '#AFAFAF', fontWeight: 600 },
  learnBtn:    { padding: '7px 14px', background: '#58CC02', border: 'none', borderRadius: 10, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, color: '#fff', cursor: 'pointer' },
  learnedBtn:  { background: '#D7F5C3', color: '#46A302', cursor: 'default' },
  empty:       { textAlign: 'center', padding: '40px 0', fontSize: 16, color: '#AFAFAF', fontWeight: 700 },
}