import { Link } from 'react-router-dom'
import { FiZap, FiTarget, FiTrendingUp, FiBookOpen, FiArrowRight, FiStar, FiCpu, FiCheck } from 'react-icons/fi'

const FEATURES = [
  {
    icon: <FiTarget className="w-5 h-5" />,
    color: '#3b82f6',
    title: 'ATS Compatibility Score',
    desc: 'Detailed ATS score across 5 dimensions — keywords, sections, action verbs, metrics, and formatting.'
  },
  {
    icon: <FiZap className="w-5 h-5" />,
    color: '#8b5cf6',
    title: 'Job Description Match',
    desc: 'Match percentage with skill breakdowns — matched, missing, and extra skills via alias-aware NLP.'
  },
  {
    icon: <FiCpu className="w-5 h-5" />,
    color: '#10b981',
    title: 'AI Improvement Tips',
    desc: 'Rule-based and Gemini AI suggestions to rewrite weak bullets, add metrics, and optimize structure.'
  },
  {
    icon: <FiBookOpen className="w-5 h-5" />,
    color: '#f59e0b',
    title: 'Skill Gap Roadmap',
    desc: 'Curated learning paths with topics, resources, and estimated time for every missing skill.'
  },
]

const STATS = [
  { value: '100%', label: 'Free' },
  { value: '5', label: 'ATS Dimensions' },
  { value: 'Gemini', label: 'AI Engine' },
  { value: '150+', label: 'Skills Tracked' },
]

const HOW_IT_WORKS = [
  { step: 1, title: 'Upload Resume', desc: 'Upload your PDF. Our parser extracts skills, experience, and more with alias-aware matching.', color: '#3b82f6' },
  { step: 2, title: 'Paste Job Description', desc: "Paste the target JD. Our NLP engine identifies required and preferred skills.", color: '#8b5cf6' },
  { step: 3, title: 'Get AI Insights', desc: 'ATS score, match %, skill gaps, AI suggestions, and a personalized learning roadmap.', color: '#10b981' },
]

export default function HomePage() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }} className="overflow-x-hidden">

      {/* ---- HERO ---- */}
      <section className="relative py-28 md:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', color: '#60a5fa' }}>
            <FiZap className="w-3 h-3" />
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-glow 2s infinite' }} />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
            Land Your{' '}
            <span className="text-gradient" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite' }}>
              Dream Job
            </span>
            <br className="hidden sm:block" />
            {' '}With AI Precision
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Analyze your resume against any job description. Get ATS scores,
            skill gaps, AI suggestions, and learning roadmaps — instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              <span>Start Free Analysis</span> <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-20 max-w-xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="py-4 px-2 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-slate-600 text-[11px] mt-0.5 font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything to <span className="text-gradient">get hired</span>
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              A complete resume intelligence suite for modern job seekers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover group p-6 cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}12`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Three simple steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px"
                    style={{ background: `linear-gradient(90deg, ${item.color}25, transparent)` }} />
                )}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl font-bold transition-transform duration-300 hover:scale-105"
                  style={{ background: `${item.color}08`, border: `1px solid ${item.color}15`, color: item.color }}>
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 0 80px rgba(59,130,246,0.04)' }}>
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)' }} />
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 0 24px rgba(245,158,11,0.15)' }}>
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to get hired?</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Optimize your resume with AI-powered analysis and land more interviews.
            </p>
            <Link to="/register" className="btn-primary text-base px-10 py-3.5 inline-flex">
              <span>Start For Free</span> <FiArrowRight />
            </Link>
            <p className="text-slate-700 text-xs mt-4">No credit card required</p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <p className="text-slate-700 text-xs">&copy; {new Date().getFullYear()} HireLens AI</p>
      </footer>
    </div>
  )
}
