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
    <div className="min-h-[calc(100vh-4rem)] flex" style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] opacity-[0.06]" style={{ background: '#3b82f6' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[100px] opacity-[0.04]" style={{ background: '#7c3aed' }} />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-14">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 0 16px rgba(59,130,246,0.3)' }}>
              <FiZap className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg"><span className="text-white">Hire</span><span className="text-gradient">Lens</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 leading-snug">Your AI-powered<br />resume companion</h2>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-xs">Land more interviews with intelligent ATS analysis and personalized insights.</p>

          <div className="space-y-3.5">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <FiCheck className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-slate-400 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-700 text-xs">&copy; {new Date().getFullYear()} HireLens AI</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md" style={{ animation: 'slideUp 0.4s ease' }}>
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
              <FiZap className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">HireLens</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account</p>
          </div>

          <div className="rounded-2xl p-7" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input type="email" className="input-field pl-11" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input type="password" className="input-field pl-11" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <><span>Sign In</span> <FiArrowRight /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
