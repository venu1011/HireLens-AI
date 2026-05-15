import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resumeAPI, analysisAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FiUpload, FiFileText, FiBarChart2, FiArrowRight, FiTrendingUp, FiZap } from 'react-icons/fi'
import ScoreRing from '../components/Charts/ScoreRing'

export default function DashboardPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = () => {
      setLoading(true)
      setError('')
      Promise.all([
        resumeAPI.getAll({ page: 1, limit: 10 }),
        analysisAPI.getAll({ page: 1, limit: 5 })
      ])
        .then(([rRes, aRes]) => {
          setResumes(rRes.data.resumes || [])
          setAnalyses(aRes.data.analyses || [])
        })
        .catch(() => setError('Unable to load dashboard data.'))
        .finally(() => setLoading(false))
    }

    fetchDashboard()
  }, [])

  const latestResume = resumes[0]
  const avgATS = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + r.atsScore.total, 0) / resumes.length)
    : 0

  if (loading) return <LoadingState />

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm font-bold text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary py-2 px-6 text-sm">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 0 16px rgba(59,130,246,0.2)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-main">
              Welcome, <span className="text-gradient">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-muted text-sm">Your resume intelligence dashboard</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <FiFileText className="w-5 h-5" />, label: 'Resumes', value: resumes.length, color: '#3b82f6' },
          { icon: <FiBarChart2 className="w-5 h-5" />, label: 'Analyses', value: analyses.length, color: '#8b5cf6' },
          { icon: <FiTrendingUp className="w-5 h-5" />, label: 'Avg ATS', value: `${avgATS}%`, color: '#10b981' },
          { icon: <FiZap className="w-5 h-5" />, label: 'Best Match', value: analyses.length ? `${Math.max(...analyses.map(a => a.matchScore))}%` : '—', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 * i }} className="stat-card">
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="grid lg:grid-cols-3 gap-5">
        {/* Latest Resume */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-sm">Latest Resume</h2>
              <Link to="/analyze" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors font-medium">
                Upload <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {latestResume ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-3">
                  <ScoreRing score={latestResume.atsScore.total} size={140} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white truncate text-sm">{latestResume.fileName}</p>
                  <p className="text-slate-600 text-xs mt-1">
                    Version {latestResume.version} · {new Date(latestResume.createdAt).toLocaleDateString()}
                    {latestResume.atsScore.grade && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${getScoreHex(latestResume.atsScore.total)}15`, color: getScoreHex(latestResume.atsScore.total) }}>Grade {latestResume.atsScore.grade}</span>}
                  </p>
                </div>
                <div className="space-y-2.5 pt-3">
                  {Object.entries(latestResume.atsScore.breakdown).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{formatKey(key)}</span>
                        <span className="font-medium text-slate-300">{val}/{getMax(key)}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(val / getMax(key)) * 100}%`, background: getBarColor((val / getMax(key)) * 100) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon={<FiUpload className="w-6 h-6 text-slate-700" />} title="No resume yet" link="/analyze" linkText="Upload Resume" />
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-sm">Recent Analyses</h2>
              <Link to="/history" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors font-medium">
                View all <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {analyses.length > 0 ? (
              <div className="space-y-2">
                {analyses.slice(0, 5).map(a => (
                  <Link key={a._id} to={`/analysis/${a._id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'; e.currentTarget.style.background = 'rgba(59,130,246,0.03)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(139,92,246,0.08)' }}>
                        <FiBarChart2 className="text-violet-400 w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{a.jobTitle || 'Job Analysis'}</p>
                        <p className="text-xs text-slate-600">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: getScoreHex(a.matchScore) }}>{a.matchScore}%</div>
                        <div className="text-[10px] text-slate-600 font-medium">match</div>
                      </div>
                      <FiArrowRight className="text-slate-700 group-hover:text-slate-400 transition-colors w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon={<FiBarChart2 className="w-6 h-6 text-slate-700" />} title="No analyses yet" desc="Upload a resume and paste a job description" link="/analyze" linkText="Run Analysis" />
            )}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      {resumes.length > 0 && (
        <div className="mt-5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h3 className="font-semibold text-white text-sm">Ready to analyze against a new job?</h3>
            <p className="text-slate-600 text-xs mt-0.5">Paste a job description and see how well your resume matches</p>
          </div>
          <Link to="/analyze" className="btn-primary shrink-0 py-2.5 px-6 text-sm">
            <span>New Analysis</span> <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="group cursor-default">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}10`, color }}>
        {icon}
      </div>
      <div className="text-2xl font-black text-main">{value}</div>
      <div className="text-muted text-xs mt-1 font-bold uppercase tracking-widest">{label}</div>
    </div>
  )
}

function EmptyState({ icon, title, desc, link, linkText }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {icon}
      </div>
      <p className="text-slate-400 font-medium text-sm">{title}</p>
      {desc && <p className="text-slate-600 text-xs max-w-xs">{desc}</p>}
      {link && (
        <Link to={link} className="btn-primary text-sm py-2 px-5 mt-1">
          <span>{linkText}</span> <FiArrowRight />
        </Link>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl h-24" style={{ background: 'rgba(255,255,255,0.02)', animation: 'pulse-glow 2s infinite' }} />
        ))}
      </div>
      <div className="text-center mt-16 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
        <p className="text-slate-600 text-sm">Loading dashboard...</p>
      </div>
    </div>
  )
}

function getScoreHex(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function getBarColor(pct) {
  if (pct >= 70) return '#22c55e'
  if (pct >= 40) return '#eab308'
  return '#ef4444'
}

function formatKey(key) {
  const map = { keywordMatch: 'Keywords', sectionCompleteness: 'Sections', actionVerbs: 'Action Verbs', measurableMetrics: 'Metrics', formattingRules: 'Formatting' }
  return map[key] || key
}

function getMax(key) {
  const map = { keywordMatch: 40, sectionCompleteness: 20, actionVerbs: 15, measurableMetrics: 15, formattingRules: 10 }
  return map[key] || 100
}
