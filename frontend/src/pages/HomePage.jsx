import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiZap, FiTarget, FiTrendingUp, FiBookOpen, FiArrowRight, FiStar, FiCpu, FiCheck, FiColumns, FiDownload, FiShield, FiFileText, FiAward, FiPieChart } from 'react-icons/fi'

const FEATURES = [
  {
    icon: <FiPieChart />,
    color: '#3b82f6',
    title: 'ATS Scoring Engine',
    desc: 'Deep multi-dimensional analysis of keyword density, section structure, and impact metrics.'
  },
  {
    icon: <FiZap />,
    color: '#8b5cf6',
    title: 'NVIDIA AI Logic',
    desc: 'Powered by Llama-3 and NVIDIA NIM for professional context-aware resume optimization.'
  },
  {
    icon: <FiColumns />,
    color: '#10b981',
    title: 'Visual Diff View',
    desc: 'Side-by-side comparison highlighting key improvements and missing job requirements.'
  },
  {
    icon: <FiBookOpen />,
    color: '#f59e0b',
    title: 'Skill Gap Roadmaps',
    desc: 'Personalized learning paths with curated resources for every missing role requirement.'
  },
  {
    icon: <FiAward />,
    color: '#ec4899',
    title: 'Interview Strategy',
    desc: 'AI-generated tactical guides with 10 role-specific questions and winning response outlines.'
  },
  {
    icon: <FiFileText />,
    color: '#14b8a6',
    title: 'Smart Cover Letters',
    desc: 'High-impact, tailored cover letters that bridge your experience with job expectations.'
  },
]

const STEPS = [
  { step: '01', title: 'Upload & Scan', desc: 'Securely upload your PDF. Our engine parses experience with alias-aware intelligence.' },
  { step: '02', title: 'Target Job', desc: 'Paste the job description. We identify strict requirements and hidden preferences.' },
  { step: '03', title: 'Get Hired', desc: 'Download your optimized resume, cover letter, and interview prep kit kit.' },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="overflow-x-hidden min-h-screen bg-app">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 px-4">
        {/* Background Accents (Robust) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.12] blur-[120px]" 
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-[0.1] blur-[100px]" 
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        </div>

        <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 backdrop-blur-3xl shadow-lg">
              <FiZap className="w-4 h-4" /> Next-Gen AI Career Suite
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-9xl font-black mb-8 leading-[0.88] tracking-tighter text-main">
              LAND YOUR <br />
              <span className="text-gradient">DREAM CAREER.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-2xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed font-bold">
              HireLens combines NVIDIA-powered intelligence with executive design 
              to maximize your ATS score and automate your job search.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to={user ? "/analyze" : "/register"} className="btn-primary w-full sm:w-auto text-lg shadow-xl translate-z-0">
                Start Free Analysis <FiArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link to="/history" className="btn-secondary w-full sm:w-auto text-lg shadow-md translate-z-0">
                Explore Analytics
              </Link>
            </motion.div>
        </div>

        {/* Hero Mockup (Full Visibility) */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 relative max-w-5xl mx-auto">
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-app to-transparent z-10 pointer-events-none" />
          <div className="card p-4 overflow-hidden shadow-2xl scale-[1.02]">
             {/* Mock UI Structure */}
             <div className="flex gap-4 items-center mb-6 border-b border-white/5 pb-4 px-4 overflow-hidden">
                <div className="flex gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="h-2 flex-1 rounded-full bg-slate-500/10" />
                <div className="h-8 w-24 rounded-xl bg-blue-500/10" />
             </div>

             <div className="grid md:grid-cols-3 gap-6 opacity-40">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-40 rounded-3xl bg-slate-500/5 animate-pulse-soft" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-3xl bg-slate-500/5" />
                    <div className="h-32 rounded-3xl bg-slate-500/5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-full rounded-3xl bg-slate-500/5 border border-dashed border-slate-500/20" />
                </div>
             </div>
             
             {/* Dynamic Float Overlay */}
             <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-20 w-[90%] pointer-events-none">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/5 p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-3xl text-center max-w-md mx-auto">
                    <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">98.5%</div>
                    <div className="text-xs font-black uppercase tracking-widest text-muted">ATS Compliance Average</div>
                </motion.div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 text-center">
            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">INTELLIGENT BY DESIGN.</h2>
            <p className="text-muted text-xl max-w-2xl mx-auto font-bold">Built for high-authority job search automation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} transition={{ duration: 0.3 }}
                className="card p-10 group cursor-default border-slate-500/20 hover:border-blue-500/50">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-8 text-3xl shadow-lg transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="text-muted text-base leading-relaxed font-bold">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STEPS --- */}
      <section className="py-32 px-4 bg-white/[0.02]">
         <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-16">
               {STEPS.map((s, i) => (
                 <div key={i} className="relative group">
                    <div className="text-[12rem] font-black text-slate-500/5 absolute -top-32 -left-6 pointer-events-none transition-all duration-500 group-hover:text-blue-500/10 group-hover:-translate-y-4">
                      {s.step}
                    </div>
                    <div className="relative">
                      <h3 className="text-3xl font-black mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.title}</h3>
                      <p className="text-muted text-base leading-relaxed font-bold">{s.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[2rem] sm:rounded-[4rem] p-10 sm:p-16 md:p-28 text-center relative overflow-hidden bg-slate-950 shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-tight">
              YOUR CAREER <br />DESERVES BEST.
            </h2>
            <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto mb-14 font-bold">
              Join the elite circle of applicants bypassing ATS filters with AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="bg-white text-blue-900 font-black py-4 sm:py-5 px-10 sm:px-14 rounded-3xl hover:scale-105 transition-all shadow-2xl text-lg sm:text-xl w-full sm:w-auto">
                  Get Started Free
                </Link>
                <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs">
                  <FiShield className="w-5 h-5" /> Enterprise Level Security
                </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="py-16 px-4 border-t border-slate-500/10 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg">H</div>
              <span className="font-black text-xl tracking-tighter">HireLens AI</span>
           </div>
           <p className="text-muted text-sm font-black uppercase tracking-widest">&copy; 2026 Deep Coding Edition.</p>
           <div className="flex gap-10">
             <a href="#" className="text-muted hover:text-main transition-colors text-sm font-black uppercase tracking-widest">Security</a>
             <a href="#" className="text-muted hover:text-main transition-colors text-sm font-black uppercase tracking-widest">Compliance</a>
           </div>
        </div>
      </footer>
    </div>
  )
}
