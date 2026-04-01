import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Home, BookOpen, BookMarked, Trophy, User, LogOut, BarChart2 } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  if (user?.role === 'admin') {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo" onClick={() => navigate('/admin')}>
  <img src="linguaflow_logo.png" alt="LinguaFlow" style={{ width: 64, height: 64, objectFit: 'contain' }} />
</div>
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <BarChart2 size={22} />
            Stats
          </NavLink>
          <div className="sidebar-bottom">
            <button className="nav-link" onClick={handleLogout}>
              <LogOut size={22} />
              Exit
            </button>
          </div>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/home')}>
  <img src="/linguaflow_logo.png" alt="LinguaFlow" style={{ width: 70, height: 70, objectFit: 'contain' }} />
</div>
        <NavLink to="/home" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <Home size={22} />
          Learn
        </NavLink>
        <NavLink to="/home/lessons" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <BookOpen size={22} />
          Lessons
        </NavLink>
        <NavLink to="/home/words" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <BookMarked size={22} />
          Words
        </NavLink>
        <NavLink to="/home/leaderboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <Trophy size={22} />
          Top
        </NavLink>
        <NavLink to="/home/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <User size={22} />
          Profile
        </NavLink>
        <div className="sidebar-bottom">
          <button className="nav-link" onClick={handleLogout}>
            <LogOut size={22} />
            Exit
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
