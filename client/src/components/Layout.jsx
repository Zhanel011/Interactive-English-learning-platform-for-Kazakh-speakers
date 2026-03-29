import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  if (user?.role === 'admin') {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo" onClick={() => navigate('/admin')}>⚙️</div>
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon">📊</span>Stats
          </NavLink>
          <div className="sidebar-bottom">
            <button className="nav-link" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>Exit
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
        <div className="sidebar-logo" onClick={() => navigate('/home')}>🦜</div>
        <NavLink to="/home" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🏠</span>Learn
        </NavLink>
        <NavLink to="/home/lessons" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📚</span>Lessons
        </NavLink>
        <NavLink to="/home/words" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📖</span>Words
        </NavLink>
        <NavLink to="/home/leaderboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🏆</span>Top
        </NavLink>
        <NavLink to="/home/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">👤</span>Profile
        </NavLink>
        <div className="sidebar-bottom">
          <button className="nav-link" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>Exit
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}