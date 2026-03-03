import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FiUpload, FiFileText, FiBarChart2, FiArrowRight, FiTrendingUp, FiAlertCircle, FiZap } from 'react-icons/fi'
import ScoreRing from '../components/Charts/ScoreRing'

export default function DashboardPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([resumeAPI.getAll(), analysisAPI.getAll()])
      .then(([rRes, aRes]) => {
        setResumes(rRes.data.resumes || [])
        setAnalyses(aRes.data.analyses || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const latestResume = resumes[0]
  const latestAnalysis = analyses[0]
  const avgATS = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + r.atsScore.total, 0) / resumes.length)
    : 0

  if (loading) return <LoadingState />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Welcome back, <span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 text-sm">Your resume intelligence dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FiFileText className="w-5 h-5" />}
          label="Resumes Uploaded"
          value={resumes.length}
          color="#3b82f6"
          glow="rgba(59,130,246,0.2)"
        />
        <StatCard
          icon={<FiBarChart2 className="w-5 h-5" />}
          label="Analyses Run"
          value={analyses.length}
          color="#8b5cf6"
          glow="rgba(139,92,246,0.2)"
        />
        <StatCard
          icon={<FiTrendingUp className="w-5 h-5" />}
          label="Avg ATS Score"
          value={`${avgATS}%`}
          color="#10b981"
          glow="rgba(16,185,129,0.2)"
        />
        <StatCard
          icon={<FiZap className="w-5 h-5" />}
          label="Best Match"
          value={analyses.length ? `${Math.max(...analyses.map(a => a.matchScore))}%` : '—'}
          color="#f59e0b"
          glow="rgba(245,158,11,0.2)"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Latest Resume */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Latest Resume</h2>
              <Link to="/analyze" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors font-medium">
                Upload new <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {latestResume ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <ScoreRing score={latestResume.atsScore.total} size={140} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white truncate">{latestResume.fileName}</p>
                  <p className="text-slate-500 text-xs mt-1">Version {latestResume.version} · {new Date(latestResume.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {Object.entries(latestResume.atsScore.breakdown).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{formatKey(key)}</span>
                        <span className="font-medium text-slate-300">{val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(51,65,85,0.6)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(val / getMax(key)) * 100}%`,
                            background: 'linear-gradient(90deg,#3b82f6,#7c3aed)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<FiUpload className="w-8 h-8 text-slate-600" />}
                title="No resume yet"
                link="/analyze"
                linkText="Upload Resume"
              />
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Analyses</h2>
              <Link to="/history" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors font-medium">
                View all <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {analyses.length > 0 ? (
              <div className="space-y-2.5">
                {analyses.slice(0, 5).map(a => (
                  <Link
                    key={a._id}
                    to={`/analysis/${a._id}`}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(59,130,246,0.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)'; e.currentTarget.style.background = 'rgba(15,23,42,0.6)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        <FiBarChart2 className="text-violet-400 w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{a.jobTitle || 'Job Analysis'}</p>
                        <p className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(a.matchScore)}`}>{a.matchScore}%</div>
                        <div className="text-xs text-slate-600">match</div>
                      </div>
                      <FiArrowRight className="text-slate-600 group-hover:text-slate-400 transition-colors w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FiBarChart2 className="w-8 h-8 text-slate-600" />}
                title="No analyses yet"
                desc="Upload a resume and paste a job description to get started"
                link="/analyze"
                linkText="Run Analysis"
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick Action CTA */}
      {resumes.length > 0 && (
        <div className="mt-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg,rgba(59,130,246,0.10),rgba(124,58,237,0.10))',
            border: '1px solid rgba(59,130,246,0.25)',
            boxShadow: '0 0 40px rgba(59,130,246,0.06)'
          }}>
          <div>
            <h3 className="font-semibold text-white">Ready to analyze against a new job?</h3>
            <p className="text-slate-400 text-sm mt-0.5">Paste a job description and see how well your resume matches</p>
          </div>
          <Link to="/analyze" className="btn-primary shrink-0 py-3 px-7">
            Run New Analysis <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color, glow }) {
  return (
    <div className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: 'rgba(15,23,42,0.7)',
        border: `1px solid ${color}20`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 0 30px ${glow}`
      }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-slate-500 text-xs mt-0.5 font-medium">{label}</div>
    </div>
  )
}

function EmptyState({ icon, title, desc, link, linkText }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      {icon}
      <p className="text-slate-400 font-medium">{title}</p>
      {desc && <p className="text-slate-600 text-sm max-w-xs">{desc}</p>}
      {link && (
        <Link to={link} className="btn-primary text-sm py-2 px-4 mt-2">
          {linkText} <FiArrowRight />
        </Link>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card animate-pulse h-24" style={{ background: 'rgba(30,41,59,0.5)' }} />
        ))}
      </div>
      <div className="text-center text-slate-500 mt-12 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading your dashboard...</p>
      </div>
    </div>
  )
}

function getScoreColor(score) {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

function formatKey(key) {
  const map = {
    keywordMatch: 'Keyword Match',
    sectionCompleteness: 'Sections',
    actionVerbs: 'Action Verbs',
    measurableMetrics: 'Metrics',
    formattingRules: 'Formatting'
  }
  return map[key] || key
}

function getMax(key) {
  const map = { keywordMatch: 40, sectionCompleteness: 20, actionVerbs: 15, measurableMetrics: 15, formattingRules: 10 }
  return map[key] || 100
}
