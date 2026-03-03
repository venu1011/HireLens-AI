import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiFileText, FiBarChart2, FiTrash2, FiArrowRight, FiTrendingUp, FiCalendar, FiClock, FiZap } from 'react-icons/fi'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'
  const glow = score >= 70 ? 'rgba(34,197,94,0.3)' : score >= 40 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'
  return (
    <div style={{
      fontWeight: 700, fontSize: '1.1rem', color,
      textShadow: `0 0 12px ${glow}`, minWidth: 44, textAlign: 'right'
    }}>
      {score}%
    </div>
  )
}

function RowCard({ children, accentColor = 'rgba(59,130,246,0.18)' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(15,23,42,0.70)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? accentColor : 'rgba(148,163,184,0.08)'}`,
        borderRadius: 16,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 24px ${accentColor}` : '0 2px 8px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </div>
  )
}

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
    } catch {
      toast.error('Failed to delete')
    }
  }

  const deleteAnalysis = async (id) => {
    if (!confirm('Delete this analysis?')) return
    try {
      await analysisAPI.delete(id)
      setAnalyses(prev => prev.filter(a => a._id !== id))
      toast.success('Analysis deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const sortedResumes = [...resumes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const atsChartData = {
    labels: sortedResumes.map(r => `v${r.version}`),
    datasets: [{
      label: 'ATS Score',
      data: sortedResumes.map(r => r.atsScore.total),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 9,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        borderColor: 'rgba(59,130,246,0.3)',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 10,
      }
    },
    scales: {
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(30,41,59,0.8)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: {
        grid: { color: 'rgba(30,41,59,0.8)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  }

  const bestScore = resumes.length ? Math.max(...resumes.map(r => r.atsScore.total)) : 0
  const avgScore = resumes.length ? Math.round(resumes.reduce((s, r) => s + r.atsScore.total, 0) / resumes.length) : 0

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(59,130,246,0.15)',
        borderTop: '3px solid #3b82f6',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading history…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem', animation: 'scaleIn 0.4s ease' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6
          }}>
            History &amp; Versions
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track your resume improvements over time</p>
        </div>
        <Link to="/analyze" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
          <FiZap /> New Analysis
        </Link>
      </div>

      {/* Quick stats */}
      {resumes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Resumes', value: resumes.length, color: '#3b82f6', glow: 'rgba(59,130,246,0.25)', icon: <FiFileText /> },
            { label: 'Total Analyses', value: analyses.length, color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', icon: <FiBarChart2 /> },
            { label: 'Best ATS Score', value: `${bestScore}%`, color: '#22c55e', glow: 'rgba(34,197,94,0.25)', icon: <FiTrendingUp /> },
            { label: 'Avg ATS Score', value: `${avgScore}%`, color: '#eab308', glow: 'rgba(234,179,8,0.25)', icon: <FiClock /> },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(15,23,42,0.70)', backdropFilter: 'blur(16px)',
              border: `1px solid ${s.color}30`, borderRadius: 16, padding: '1.1rem 1.25rem',
              boxShadow: `0 0 20px ${s.glow}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: s.color, fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ATS Progression Chart */}
      {resumes.length > 1 && (
        <div style={{
          background: 'rgba(15,23,42,0.70)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59,130,246,0.15)', borderRadius: 20,
          padding: '1.5rem', marginBottom: '2rem',
          boxShadow: '0 0 32px rgba(59,130,246,0.08)',
        }}>
          <h2 style={{ fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiTrendingUp style={{ color: '#22c55e' }} /> ATS Score Progression
          </h2>
          <Line data={atsChartData} options={chartOptions} height={80} />
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid rgba(148,163,184,0.08)',
        borderRadius: 16, marginBottom: '1.5rem'
      }}>
        {[
          { key: 'resumes', label: 'Resumes', count: resumes.length, icon: <FiFileText />, activeColor: 'linear-gradient(135deg,#3b82f6,#6366f1)', activeGlow: 'rgba(59,130,246,0.35)' },
          { key: 'analyses', label: 'Analyses', count: analyses.length, icon: <FiBarChart2 />, activeColor: 'linear-gradient(135deg,#7c3aed,#a78bfa)', activeGlow: 'rgba(124,58,237,0.35)' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '0.7rem', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.25s ease',
              background: tab === t.key ? t.activeColor : 'transparent',
              color: tab === t.key ? '#fff' : '#64748b',
              boxShadow: tab === t.key ? `0 0 16px ${t.activeGlow}` : 'none',
            }}
          >
            {t.icon} {t.label} <span style={{
              background: tab === t.key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
              borderRadius: 99, padding: '1px 8px', fontSize: '0.75rem'
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Resumes Tab */}
      {tab === 'resumes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {resumes.length === 0 ? (
            <EmptyState icon={<FiFileText />} text="No resumes uploaded yet" link="/analyze" linkText="Upload Resume" color="#3b82f6" />
          ) : (
            resumes.map(r => (
              <RowCard key={r._id} accentColor="rgba(59,130,246,0.25)">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FiFileText style={{ color: '#60a5fa', width: 18, height: 18 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fileName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748b', fontSize: '0.75rem', marginTop: 3 }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                        borderRadius: 99, padding: '1px 8px', fontWeight: 600
                      }}>v{r.version}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiCalendar style={{ width: 11, height: 11 }} />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <ScoreBadge score={r.atsScore.total} />
                  <DeleteBtn onClick={() => deleteResume(r._id)} />
                </div>
              </RowCard>
            ))
          )}
        </div>
      )}

      {/* Analyses Tab */}
      {tab === 'analyses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analyses.length === 0 ? (
            <EmptyState icon={<FiBarChart2 />} text="No analyses run yet" link="/analyze" linkText="Run Analysis" color="#7c3aed" />
          ) : (
            analyses.map(a => (
              <RowCard key={a._id} accentColor="rgba(124,58,237,0.25)">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FiBarChart2 style={{ color: '#a78bfa', width: 18, height: 18 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.jobTitle || 'Job Analysis'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748b', fontSize: '0.75rem', marginTop: 3 }}>
                      <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.resumeId?.fileName || 'Resume'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiCalendar style={{ width: 11, height: 11 }} />
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <ScoreBadge score={a.matchScore} />
                  <Link
                    to={`/analysis/${a._id}`}
                    style={{
                      width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)',
                      background: 'rgba(59,130,246,0.08)', color: '#60a5fa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(59,130,246,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <FiArrowRight style={{ width: 15, height: 15 }} />
                  </Link>
                  <DeleteBtn onClick={() => deleteAnalysis(a._id)} />
                </div>
              </RowCard>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function DeleteBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: 10, border: `1px solid ${hov ? 'rgba(239,68,68,0.4)' : 'rgba(148,163,184,0.1)'}`,
        background: hov ? 'rgba(239,68,68,0.12)' : 'rgba(15,23,42,0.5)',
        color: hov ? '#f87171' : '#64748b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease',
        boxShadow: hov ? '0 0 12px rgba(239,68,68,0.2)' : 'none',
      }}
    >
      <FiTrash2 style={{ width: 14, height: 14 }} />
    </button>
  )
}

function EmptyState({ icon, text, link, linkText, color = '#3b82f6' }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.70)', backdropFilter: 'blur(16px)',
      border: `1px solid ${color}20`, borderRadius: 20,
      padding: '4rem 2rem', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', color: `${color}99`
      }}>
        {icon}
      </div>
      <p style={{ color: '#64748b', fontSize: '1rem' }}>{text}</p>
      <Link to={link} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}>
        {linkText} <FiArrowRight />
      </Link>
    </div>
  )
}
