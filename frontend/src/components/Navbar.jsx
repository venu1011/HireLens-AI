import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiLogOut, FiUpload, FiHome, FiClock, FiZap, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-3xl"
      style={{
        background: theme === 'dark' ? 'rgba(3,7,18,0.7)' : 'rgba(255,255,255,0.7)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-6 bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20">
              <FiZap className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-main">
              Hire<span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5 p-1 rounded-xl bg-slate-500/5 border border-slate-500/10">
              <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<FiHome className="w-3.5 h-3.5" />}>Dashboard</NavLink>
              <NavLink to="/analyze" active={isActive('/analyze')} icon={<FiUpload className="w-3.5 h-3.5" />}>Analyze</NavLink>
              <NavLink to="/history" active={isActive('/history')} icon={<FiClock className="w-3.5 h-3.5" />}>History</NavLink>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} 
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-slate-500/10 border border-slate-500/10 text-slate-500 hover:text-blue-500"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? <FiSun className="w-5 h-5 text-yellow-400" /> : <FiMoon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-500/5 border border-slate-500/10 transition-colors">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-blue-500 to-violet-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-main opacity-80 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                  title="Logout">
                  <FiLogOut className="w-4 h-4" />
                </button>
                <button className="md:hidden p-2 rounded-xl bg-slate-500/5 text-slate-400"
                  onClick={() => setMenuOpen(o => !o)}>
                  {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-slate-500 hover:text-blue-500 transition-colors text-sm px-4 py-2 font-semibold">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 !shadow-none">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && menuOpen && (
          <div className="md:hidden pb-4" style={{ animation: 'slideUp 0.2s ease' }}>
            <div className="flex flex-col gap-1 p-2 rounded-2xl bg-slate-500/5 border border-slate-500/10">
              <MobileNavLink to="/dashboard" active={isActive('/dashboard')} icon={<FiHome />} onClick={() => setMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink to="/analyze" active={isActive('/analyze')} icon={<FiUpload />} onClick={() => setMenuOpen(false)}>Analyze Resume</MobileNavLink>
              <MobileNavLink to="/history" active={isActive('/history')} icon={<FiClock />} onClick={() => setMenuOpen(false)}>History</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, active, icon, children }) {
  const { theme } = useTheme()
  return (
    <Link to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
        active 
          ? (theme === 'dark' ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20') 
          : 'text-slate-500 hover:text-blue-500'
      }`}>
      {icon} {children}
    </Link>
  )
}

function MobileNavLink({ to, active, icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active ? 'text-blue-500 bg-blue-500/5' : 'text-slate-500 hover:text-blue-500 hover:bg-slate-500/5'
      }`}>
      <span className={active ? 'text-blue-500' : 'opacity-40'}>{icon}</span>
      {children}
    </Link>
  )
}
