import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiUser, FiUpload, FiHome, FiClock, FiZap, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
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
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(5,8,19,0.80)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51,65,85,0.4)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.4)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                boxShadow: '0 0 20px rgba(59,130,246,0.4)'
              }}
            >
              <FiZap className="text-white w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              HireLens<span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
              <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<FiHome />}>Dashboard</NavLink>
              <NavLink to="/analyze" active={isActive('/analyze')} icon={<FiUpload />}>Analyze</NavLink>
              <NavLink to="/history" active={isActive('/history')} icon={<FiClock />}>History</NavLink>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                {/* Mobile menu toggle */}
                <button
                  className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  onClick={() => setMenuOpen(o => !o)}
                >
                  {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm px-4 py-2 rounded-xl hover:bg-slate-800">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && menuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1 p-2 rounded-xl" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.4)' }}>
              <MobileNavLink to="/dashboard" active={isActive('/dashboard')} icon={<FiHome />} onClick={() => setMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink to="/analyze" active={isActive('/analyze')} icon={<FiUpload />} onClick={() => setMenuOpen(false)}>Analyze Resume</MobileNavLink>
              <MobileNavLink to="/history" active={isActive('/history')} icon={<FiClock />} onClick={() => setMenuOpen(false)}>Analysis History</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, active, icon, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      }`}
      style={active ? {
        background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(124,58,237,0.15))',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: '0 0 12px rgba(59,130,246,0.15)'
      } : {}}
    >
      {icon}
      {children}
    </Link>
  )
}

function MobileNavLink({ to, active, icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        active ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
      }`}
    >
      <span className={active ? 'text-blue-400' : 'text-slate-500'}>{icon}</span>
      {children}
    </Link>
  )
}
