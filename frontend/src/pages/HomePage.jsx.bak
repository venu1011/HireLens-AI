import { Link } from 'react-router-dom'
import { FiZap, FiTarget, FiTrendingUp, FiBookOpen, FiCheckCircle, FiArrowRight, FiStar, FiCpu, FiShield } from 'react-icons/fi'

const FEATURES = [
  {
    icon: <FiTarget className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.3)',
    title: 'ATS Compatibility Score',
    desc: 'Get a detailed ATS score out of 100 with breakdown across 5 key dimensions including keyword density, action verbs, and measurable metrics.'
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-400',
    glow: 'rgba(139,92,246,0.3)',
    title: 'Job Description Match',
    desc: 'Paste any job description and instantly see your match percentage, matched skills, missing skills, and extra skills—powered by alias-aware NLP.'
  },
  {
    icon: <FiCpu className="w-6 h-6" />,
    color: 'from-emerald-500 to-green-400',
    glow: 'rgba(16,185,129,0.3)',
    title: 'AI Improvement Suggestions',
    desc: 'Get rule-based and Gemini AI-powered suggestions to rewrite weak bullets, add metrics, and improve your professional summary.'
  },
  {
    icon: <FiBookOpen className="w-6 h-6" />,
    color: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.3)',
    title: 'Skill Gap Roadmap',
    desc: 'For every missing skill, get a curated learning roadmap with topics, resources, and estimated time to learn.'
  },
]

const STATS = [
  { value: '100%', label: 'Free to Use' },
  { value: '5 Dims', label: 'ATS Analysis' },
  { value: 'Gemini', label: 'AI Powered' },
  { value: '∞', label: 'Resume Versions' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Resume', desc: 'Upload your PDF resume. Our parser extracts skills, experience, education, and more with alias-aware matching.', icon: '📄', color: '#3b82f6' },
  { step: '02', title: 'Paste Job Description', desc: "Paste the job description you're targeting. Our NLP engine analyzes required & preferred skills accurately.", icon: '🎯', color: '#8b5cf6' },
  { step: '03', title: 'Get Insights', desc: 'Receive your ATS score, match percentage, skill gaps, AI suggestions, and a personalized learning roadmap.', icon: '🚀', color: '#10b981' },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* ---- Hero ---- */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-medium animate-slide-up"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
            <FiZap className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            Land Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite'
            }}>
              Dream Job
            </span>
            <br className="hidden sm:block" />
            {' '}With AI Precision
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            HireLens AI analyzes your resume against any job description, scores ATS compatibility,
            identifies skill gaps, and generates personalized improvement roadmaps—instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto text-lg">
              Analyze My Resume Free <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Sign In
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {STATS.map(s => (
              <div key={s.label} className="py-4 px-3 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', backdropFilter: 'blur(12px)' }}>
                <div className="text-2xl font-extrabold text-gradient">{s.value}</div>
                <div className="text-slate-500 text-xs mt-0.5 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
              <FiShield className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need<br />
              <span className="text-gradient">to Get Hired</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              A complete resume intelligence platform built for modern job seekers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(51,65,85,0.5)',
                  backdropFilter: 'blur(16px)'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${f.glow}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  style={{ boxShadow: `0 8px 24px ${f.glow}` }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to optimize your resume</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-[30%] h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
                )}
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 hover:scale-110"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25`, boxShadow: `0 0 30px ${item.color}20` }}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto"
                    style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }}>
                    {i + 1}
                  </div>
                </div>
                <div className="text-5xl font-black mb-3 mt-2" style={{ color: item.color, opacity: 0.15 }}>{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 0 80px rgba(59,130,246,0.1), 0 40px 80px rgba(0,0,0,0.3)'
            }}>
            {/* Background glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08), transparent 70%)' }} />
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}>
              <FiStar className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Hired?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Join candidates who are using HireLens AI to optimize their resumes and land more interviews.
            </p>
            <Link to="/register" className="btn-primary text-base px-10 py-4 inline-flex text-lg">
              Start For Free <FiArrowRight />
            </Link>
            <p className="text-slate-600 text-xs mt-4">No credit card required • Free forever</p>
          </div>
        </div>
      </section>
    </div>
  )
}
