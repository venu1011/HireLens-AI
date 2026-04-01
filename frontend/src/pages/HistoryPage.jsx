import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiFileText, FiBarChart2, FiTrash2, FiArrowRight, FiTrendingUp, FiCalendar, FiZap, FiPlus } from 'react-icons/fi'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function HistoryPage() {
  const [resumes, setResumes] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [tab, setTab] = useState('resumes')
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

  const deleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return
    try {
      await resumeAPI.delete(id)
      setResumes(prev => prev.filter(r => r._id !== id))
      toast.success('Resume deleted')
    } catch { toast.error('Failed to delete') }
  }

  const deleteAnalysis = async (id) => {
    if (!confirm('Delete this analysis?')) return
    try {
      await analysisAPI.delete(id)
      setAnalyses(prev => prev.filter(a => a._id !== id))
      toast.success('Analysis deleted')
    } catch { toast.error('Failed to delete') }
  }

  const bestScore = resumes.length ? Math.max(...resumes.map(r => r.atsScore.total)) : 0
  const avgScore = resumes.length ? Math.round(resumes.reduce((s, r) => s + r.atsScore.total, 0) / resumes.length) : 0

  const sortedResumes = [...resumes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const chartData = {
    labels: sortedResumes.map(r => `v${r.version}`),
    datasets: [{
      label: 'ATS Score',
      data: sortedResumes.map(r => r.atsScore.total),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.06)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    }]
  }
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-muted font-bold animate-pulse">Retrieving vault history...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
        <div>
          <h1 className="text-3xl font-black text-main tracking-tighter">Vault History</h1>
          <p className="text-muted text-base mt-2 font-bold">Comprehensive record of your career optimization journey.</p>
        </div>
        <Link to="/analyze" className="btn-primary py-3 px-8 text-sm">
          <FiPlus className="w-5 h-5" /> <span>Launch Analysis</span>
        </Link>
      </div>

      {/* Stats Grid */}
      {resumes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Archives', value: resumes.length, color: '#3b82f6', icon: <FiFileText /> },
            { label: 'Reports', value: analyses.length, color: '#8b5cf6', icon: <FiBarChart2 /> },
            { label: 'Peak ATS', value: `${bestScore}%`, color: '#10b981', icon: <FiTrendingUp /> },
            { label: 'Mean ATS', value: `${avgScore}%`, color: '#f59e0b', icon: <FiCalendar /> },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: s.color }}>
                {s.icon} {s.label}
              </div>
              <div className="text-3xl font-black text-main">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Visualization */}
      {resumes.length > 1 && (
        <div className="card mb-10 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h2 className="font-black text-main text-lg flex items-center gap-3">
              <FiTrendingUp className="text-blue-500 w-5 h-5" /> Velocity Tracking
            </h2>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">Growth View</div>
          </div>
          <div className="h-[200px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Modern Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl mb-8 bg-app/50 border border-main">
        {[
          { key: 'resumes', label: 'Resume Repository', shortLabel: 'Resumes', count: resumes.length, icon: <FiFileText /> },
          { key: 'analyses', label: 'Analysis History', shortLabel: 'Analyses', count: analyses.length, icon: <FiBarChart2 /> },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${tab === t.key ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg' : 'text-muted hover:text-main'}`}>
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.shortLabel}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] ${tab === t.key ? 'bg-white/20' : 'bg-slate-500/10'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lists */}
      <div className="grid gap-3">
        {tab === 'resumes' ? (
          resumes.length === 0 ? (
            <EmptyState icon={<FiFileText className="w-8 h-8 text-muted" />} text="Repository is currently empty." link="/analyze" linkText="Import Resume" />
          ) : resumes.map(r => (
            <div key={r._id} className="flex items-center justify-between p-5 rounded-3xl transition-all duration-300 hover:border-blue-500/40 border border-main bg-card shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center gap-5 min-w-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-black text-main truncate max-w-xs">{r.fileName}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted mt-1 uppercase tracking-widest">
                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg">v{r.version}</span>
                    <span>Modified {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                <div className="text-right">
                   <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">ATS Score</p>
                   <p className={`text-xl font-black`} style={{ color: scoreHex(r.atsScore.total) }}>{r.atsScore.total}%</p>
                </div>
                <button onClick={() => deleteResume(r._id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-all border border-main">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          analyses.length === 0 ? (
            <EmptyState icon={<FiBarChart2 className="w-8 h-8 text-muted" />} text="No diagnostic reports found." link="/analyze" linkText="Execute Analysis" />
          ) : analyses.map(a => (
            <div key={a._id} className="flex items-center justify-between p-5 rounded-3xl transition-all duration-300 hover:border-violet-500/40 border border-main bg-card shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center gap-5 min-w-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-violet-500/5 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <FiBarChart2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-black text-main truncate max-w-xs">{a.jobTitle || 'Analysis Diagnostic'}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted mt-1 uppercase tracking-widest">
                    <span className="truncate max-w-[150px]">{a.resumeId?.fileName || 'Source Document'}</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="text-right">
                   <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Match Precision</p>
                   <p className={`text-xl font-black`} style={{ color: scoreHex(a.matchScore) }}>{a.matchScore}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/analysis/${a._id}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-blue-600 hover:bg-blue-500/10 transition-all border border-main">
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                  <button onClick={() => deleteAnalysis(a._id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-all border border-main">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, text, link, linkText }) {
  return (
    <div className="card text-center py-20 flex flex-col items-center gap-5 border-dashed">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-app/50 border border-main">
        {icon}
      </div>
      <div>
        <p className="text-main font-black text-xl mb-2">{text}</p>
        <p className="text-muted font-bold text-sm">Start an analysis to generate data visualization. Diagnostic records will appear here.</p>
      </div>
      <Link to={link} className="btn-primary py-4 px-10 text-base mt-4">
        <span>{linkText}</span> <FiZap className="w-4 h-4" />
      </Link>
    </div>
  )
}

function scoreHex(score) {
  if (score >= 70) return '#10b981'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}
