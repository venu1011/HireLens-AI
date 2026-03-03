import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiFileText, FiBarChart2, FiTrash2, FiArrowRight, FiTrendingUp, FiCalendar, FiZap } from 'react-icons/fi'
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
      pointBorderColor: '#030712',
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
        backgroundColor: 'rgba(3,7,18,0.95)',
        borderColor: 'rgba(59,130,246,0.2)',
        borderWidth: 1,
        titleColor: '#64748b',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        bodyFont: { size: 12 },
      }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#334155', font: { size: 10 } } },
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#334155', font: { size: 10 } } }
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
      <p className="text-slate-600 text-sm">Loading history...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">History</h1>
          <p className="text-slate-600 text-sm mt-1">Track your resume improvements over time</p>
        </div>
        <Link to="/analyze" className="btn-primary text-sm py-2 px-5">
          <FiZap className="w-3.5 h-3.5" /> <span>New Analysis</span>
        </Link>
      </div>

      {/* Stats */}
      {resumes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Resumes', value: resumes.length, color: '#3b82f6', icon: <FiFileText className="w-3.5 h-3.5" /> },
            { label: 'Analyses', value: analyses.length, color: '#8b5cf6', icon: <FiBarChart2 className="w-3.5 h-3.5" /> },
            { label: 'Best ATS', value: `${bestScore}%`, color: '#22c55e', icon: <FiTrendingUp className="w-3.5 h-3.5" /> },
            { label: 'Avg ATS', value: `${avgScore}%`, color: '#eab308', icon: <FiCalendar className="w-3.5 h-3.5" /> },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3.5 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: s.color }}>
                {s.icon} {s.label}
              </div>
              <div className="text-lg font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {resumes.length > 1 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-green-400 w-4 h-4" /> ATS Score Progression
          </h2>
          <Line data={chartData} options={chartOptions} height={70} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {[
          { key: 'resumes', label: 'Resumes', count: resumes.length, icon: <FiFileText className="w-3.5 h-3.5" /> },
          { key: 'analyses', label: 'Analyses', count: analyses.length, icon: <FiBarChart2 className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={tab === t.key ? {
              background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.1))',
              color: '#fff',
              border: '1px solid rgba(59,130,246,0.2)',
            } : { color: 'rgba(255,255,255,0.3)' }}>
            {t.icon} {t.label}
            <span className="px-1.5 py-0.5 rounded-md text-[10px]"
              style={{ background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)' }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Resumes */}
      {tab === 'resumes' && (
        <div className="space-y-2" style={{ animation: 'slideUp 0.3s ease' }}>
          {resumes.length === 0 ? (
            <EmptyState icon={<FiFileText className="w-6 h-6 text-slate-700" />} text="No resumes uploaded yet" link="/analyze" linkText="Upload Resume" />
          ) : resumes.map(r => (
            <div key={r._id} className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)'; e.currentTarget.style.background = 'rgba(59,130,246,0.02)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,130,246,0.08)' }}>
                  <FiFileText className="text-blue-400 w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>v{r.version}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-base font-bold" style={{ color: scoreHex(r.atsScore.total) }}>{r.atsScore.total}%</span>
                <button onClick={() => deleteResume(r._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analyses */}
      {tab === 'analyses' && (
        <div className="space-y-2" style={{ animation: 'slideUp 0.3s ease' }}>
          {analyses.length === 0 ? (
            <EmptyState icon={<FiBarChart2 className="w-6 h-6 text-slate-700" />} text="No analyses run yet" link="/analyze" linkText="Run Analysis" />
          ) : analyses.map(a => (
            <div key={a._id} className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.12)'; e.currentTarget.style.background = 'rgba(139,92,246,0.02)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(139,92,246,0.08)' }}>
                  <FiBarChart2 className="text-violet-400 w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{a.jobTitle || 'Job Analysis'}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                    <span className="truncate max-w-[120px]">{a.resumeId?.fileName || 'Resume'}</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base font-bold" style={{ color: scoreHex(a.matchScore) }}>{a.matchScore}%</span>
                <Link to={`/analysis/${a._id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => deleteAnalysis(a._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, text, link, linkText }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {icon}
      </div>
      <p className="text-slate-400 font-medium text-sm">{text}</p>
      <Link to={link} className="btn-primary text-sm py-2 px-5 mt-1">
        <span>{linkText}</span> <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

function scoreHex(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}
