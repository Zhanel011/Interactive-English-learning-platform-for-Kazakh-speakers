import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout      from './components/Layout.jsx'
import Login       from './pages/Login.jsx'
import Register    from './pages/Register.jsx'
import Home        from './pages/Home.jsx'
import Lessons     from './pages/Lessons.jsx'
import Quiz        from './pages/Quiz.jsx'
import Dictionary  from './pages/Dictionary.jsx'
import Profile     from './pages/Profile.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Admin       from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px', fontSize:'32px' }}>🦜</div>
  if (!user) return <Navigate to="/login" />
  if (user.role === 'admin') return <Navigate to="/admin" />
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px', fontSize:'32px' }}>🦜</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/home" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Navigate to="/login" />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index                  element={<Home />} />
        <Route path="lessons"         element={<Lessons />} />
        <Route path="quiz/:id"        element={<Quiz />} />
        <Route path="words"           element={<Dictionary />} />
        <Route path="profile"         element={<Profile />} />
        <Route path="leaderboard"     element={<Leaderboard />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
        <Route index element={<Admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}