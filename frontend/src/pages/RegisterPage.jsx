import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const PERKS = [
  'ATS score across 5 dimensions',
  'Gemini AI-powered suggestions',
  'Accurate skill gap detection',
  'Personalized learning roadmaps',
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created! Welcome to HireLens AI 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,27,75,0.95) 100%)', borderRight: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20" style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-15" style={{ background: 'radial-gradient(circle,#3b82f6,transparent)' }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              <FiZap className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white">HireLens <span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">Start your journey<br />to the perfect job</h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed">Free forever. No credit card required. Instant results.</p>

          <div className="space-y-4">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <FiCheckCircle className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-slate-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-xs">&copy; {new Date().getFullYear()} HireLens AI. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 animate-slide-up">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
              <FiZap className="text-white w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-lg text-white">HireLens AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Start analyzing resumes with AI today — it's free</p>
          </div>

          <div className="rounded-2xl p-7" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', backdropFilter: 'blur(16px)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="text" className="input-field pl-11" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="email" className="input-field pl-11" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="password" className="input-field pl-11" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required />
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="password" className="input-field pl-11" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} required />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <FiArrowRight /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
