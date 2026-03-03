import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiUpload, FiHome, FiClock, FiZap, FiMenu, FiX } from 'react-icons/fi'
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
        background: 'rgba(3,7,18,0.6)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                boxShadow: '0 0 16px rgba(59,130,246,0.3)'
              }}
            >
              <FiZap className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-white">Hire</span>
              <span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<FiHome className="w-3.5 h-3.5" />}>Dashboard</NavLink>
              <NavLink to="/analyze" active={isActive('/analyze')} icon={<FiUpload className="w-3.5 h-3.5" />}>Analyze</NavLink>
              <NavLink to="/history" active={isActive('/history')} icon={<FiClock className="w-3.5 h-3.5" />}>History</NavLink>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 transition-all text-sm px-2.5 py-2 rounded-lg hover:bg-red-500/8"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-medium">Logout</span>
                </button>
                <button
                  className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onClick={() => setMenuOpen(o => !o)}
                >
                  {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/[0.04] font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && menuOpen && (
          <div className="md:hidden pb-4" style={{ animation: 'slideUp 0.2s ease' }}>
            <div className="flex flex-col gap-1 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active ? 'text-white' : 'text-slate-500 hover:text-slate-200'
      }`}
      style={active ? {
        background: 'rgba(255,255,255,0.06)',
        boxShadow: '0 0 12px rgba(59,130,246,0.08)'
      } : {}}
    >
      {icon} {children}
    </Link>
  )
}

function MobileNavLink({ to, active, icon, children, onClick }) {
  return (
    <Link
      to={to} onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        active ? 'text-blue-400 bg-blue-500/8' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
      }`}
    >
      <span className={active ? 'text-blue-400' : 'text-slate-600'}>{icon}</span>
      {children}
    </Link>
  )
}
