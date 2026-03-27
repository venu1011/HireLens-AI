import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi'

const PERKS = [
  'ATS score across 5 dimensions',
  'AI-powered improvement suggestions',
  'Real job description skill matching',
  'Personalized learning roadmaps',
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-app">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-16 relative overflow-hidden border-r border-main bg-white/[0.02]">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-[0.08]" style={{ background: '#3b82f6' }} />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20">
              <FiZap className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-main">Hire<span className="text-gradient">Lens</span></span>
          </div>

          <h2 className="text-5xl font-black text-main mb-6 leading-[1.1] tracking-tighter text-main">Your AI-powered<br />career strategist.</h2>
          <p className="text-muted mb-12 text-lg leading-relaxed max-w-sm font-bold">Land more interviews with intelligent ATS analysis and role-specific optimization.</p>

          <div className="space-y-4">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 border border-blue-500/20">
                  <FiCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-muted text-sm font-bold">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-muted text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} Enterprise Edition</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20">
              <FiZap className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl text-main">HireLens</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-main mb-2 tracking-tighter">Welcome back.</h1>
            <p className="text-muted font-bold text-base">Sign in to access your intelligence dashboard.</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input type="email" className="input-field pl-12 bg-app/50 font-bold text-main" placeholder="you@company.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Secure Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input type="password" className="input-field pl-12 bg-app/50 font-bold text-main" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-lg mt-4" disabled={loading}>
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Sign In</span> <FiArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-muted mt-8 font-bold text-sm">
            New to HireLens?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-colors">
              Create an account free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
