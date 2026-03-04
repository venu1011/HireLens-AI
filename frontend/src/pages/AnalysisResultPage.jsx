import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { analysisAPI } from '../services/api'
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiAlertCircle, FiBookOpen, FiZap, FiClock, FiBarChart2, FiCpu, FiTarget, FiTrendingUp, FiAward, FiShield, FiEdit3, FiUser, FiLayout, FiHash, FiFeather, FiPieChart, FiLayers, FiStar, FiTerminal, FiCrosshair, FiRefreshCw, FiColumns, FiDownload } from 'react-icons/fi'
import SkillMatchChart from '../components/Charts/SkillMatchChart'
import RadarMatchChart from '../components/Charts/RadarMatchChart'

export default function AnalysisResultPage() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [diffData, setDiffData] = useState(null)
  const [diffLoading, setDiffLoading] = useState(false)
  const [optimizeData, setOptimizeData] = useState(null)
  const [optimizeLoading, setOptimizeLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    analysisAPI.getOne(id)
      .then(res => setAnalysis(res.data.analysis))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // Load diff data when diff tab is selected
  useEffect(() => {
    if (activeTab === 'diff' && !diffData && !diffLoading) {
      setDiffLoading(true)
      analysisAPI.getDiff(id)
        .then(res => setDiffData(res.data.diff))
        .catch(console.error)
        .finally(() => setDiffLoading(false))
    }
  }, [activeTab, id, diffData, diffLoading])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
      <p className="text-slate-600 text-sm">Loading analysis...</p>
    </div>
  )

  if (!analysis) return (
    <div className="text-center py-20 text-slate-500">Analysis not found</div>
  )

  const { matchScore, matchedSkills = [], missingSkills = [], extraSkills = [], suggestions = {}, roadmap = [], resumeId } = analysis

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 className="w-3.5 h-3.5" /> },
    { id: 'diff', label: 'Diff View', icon: <FiColumns className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Feedback', icon: <FiTarget className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <FiCheckCircle className="w-3.5 h-3.5" /> },
    { id: 'suggestions', label: 'Suggestions', icon: <FiZap className="w-3.5 h-3.5" /> },
    { id: 'optimize', label: 'Optimize', icon: <FiCpu className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <FiBookOpen className="w-3.5 h-3.5" /> },
  ]

  const handleOptimize = async () => {
    if (optimizeLoading) return
    setOptimizeLoading(true)
    try {
      const res = await analysisAPI.optimize(id)
      setOptimizeData(res.data.optimized)
    } catch (err) {
      console.error('Optimize error:', err)
    } finally {
      setOptimizeLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (pdfLoading || !optimizeData) return
    setPdfLoading(true)
    try {
      const res = await analysisAPI.downloadPDF(id, {
        text: optimizeData.text,
        title: `${analysis.jobTitle || 'Optimized'} Resume`
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'optimized-resume.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF download error:', err)
    } finally {
      setPdfLoading(false)
    }
  }

  const scoreHex = (s) => s >= 70 ? '#22c55e' : s >= 40 ? '#eab308' : '#ef4444'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/history"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 shrink-0"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FiArrowLeft className="w-4 h-4 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{analysis.jobTitle || 'Analysis Result'}</h1>
          <p className="text-slate-600 text-xs mt-0.5">{new Date(analysis.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Match Score', value: `${matchScore}%`, color: scoreHex(matchScore) },
          { label: 'ATS Score', value: `${resumeId?.atsScore?.total || 0}%`, color: scoreHex(resumeId?.atsScore?.total || 0) },
          { label: 'Matched', value: matchedSkills.length, color: '#22c55e' },
          { label: 'Missing', value: missingSkills.length, color: '#ef4444' },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-slate-600 text-xs mt-1 font-medium">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center"
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.1))',
              color: '#fff',
              border: '1px solid rgba(59,130,246,0.2)',
            } : { color: 'rgba(255,255,255,0.3)' }}
          >{tab.icon} {tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
          {/* Grade + Score Hero */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${scoreHex(resumeId?.atsScore?.total || 0)}08, ${scoreHex(matchScore)}06)`, border: `1px solid ${scoreHex(resumeId?.atsScore?.total || 0)}15` }}>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div>
                <div className="text-5xl font-black" style={{ color: scoreHex(resumeId?.atsScore?.total || 0) }}>{resumeId?.atsScore?.total || 0}%</div>
                <div className="text-slate-500 text-xs mt-1 font-medium">ATS Score</div>
                {resumeId?.atsScore?.grade && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ background: `${scoreHex(resumeId?.atsScore?.total || 0)}15`, color: scoreHex(resumeId?.atsScore?.total || 0) }}>
                    <FiAward className="w-3 h-3" /> Grade {resumeId.atsScore.grade}
                  </div>
                )}
              </div>
              <div className="w-px h-16 hidden sm:block" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div>
                <div className="text-5xl font-black" style={{ color: scoreHex(matchScore) }}>{matchScore}%</div>
                <div className="text-slate-500 text-xs mt-1 font-medium">Job Match</div>
                <div className="mt-2 text-xs text-slate-600">{matchedSkills.length} of {matchedSkills.length + missingSkills.length} skills matched</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-white text-sm mb-4">Skill Match Distribution</h3>
              <SkillMatchChart matched={matchedSkills.length} missing={missingSkills.length} extra={extraSkills.length} />
            </div>
            <div className="card">
              <h3 className="font-semibold text-white text-sm mb-4">ATS Score Breakdown</h3>
              {resumeId?.atsScore?.breakdown && (
                <div className="space-y-3">
                  {Object.entries(resumeId.atsScore.breakdown).map(([key, val]) => {
                    const max = getMax(key)
                    const pct = (val / max) * 100
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{formatKey(key)}</span>
                          <span className="font-medium text-slate-300">{val}/{max}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Strengths preview */}
              {resumeId?.atsScore?.strengths?.length > 0 && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FiCheckCircle className="text-green-400 w-3 h-3" />
                    <p className="text-[10px] font-semibold text-green-400/70 uppercase tracking-wider">Strengths</p>
                  </div>
                  {resumeId.atsScore.strengths.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-green-500/50 shrink-0">+</span> {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick feedback summary CTA */}
          {(resumeId?.atsScore?.feedback?.length > 0) && (
            <button onClick={() => setActiveTab('feedback')}
              className="w-full rounded-xl p-4 text-left transition-all duration-200 group"
              style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.1)'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <FiTarget className="text-amber-400 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{resumeId.atsScore.feedback.length} improvement{resumeId.atsScore.feedback.length > 1 ? 's' : ''} found</p>
                    <p className="text-xs text-slate-600">View detailed feedback & actionable fixes</p>
                  </div>
                </div>
                <FiArrowLeft className="w-4 h-4 text-slate-600 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </motion.div>
      )}

      {/* ═══ Diff View Tab ═══ */}
      {activeTab === 'diff' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
          {diffLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
              <p className="text-slate-600 text-sm">Generating diff view...</p>
            </div>
          ) : diffData ? (
            <>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 px-1">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.4)' }} /> Matched Skill
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }} /> Missing Skill
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(234,179,8,0.25)', border: '1px solid rgba(234,179,8,0.4)' }} /> Weak Verb
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.4)' }} /> Metric
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)' }} /> Preferred
                </span>
              </div>

              {/* Side-by-Side panels */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Resume Panel */}
                <div className="card overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <FiEdit3 className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Your Resume</h3>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed max-h-[500px] overflow-y-auto pr-2 whitespace-pre-wrap font-mono" style={{ scrollbarWidth: 'thin' }}>
                    <HighlightedText text={diffData.resume.text} highlights={diffData.resume.highlights} />
                  </div>
                </div>

                {/* JD Panel */}
                <div className="card overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                      <FiTarget className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Job Description</h3>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed max-h-[500px] overflow-y-auto pr-2 whitespace-pre-wrap font-mono" style={{ scrollbarWidth: 'thin' }}>
                    <HighlightedText text={diffData.jd.text} highlights={diffData.jd.highlights} />
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Matched', value: diffData.stats.matchedCount, color: '#22c55e' },
                  { label: 'Missing', value: diffData.stats.missingCount, color: '#ef4444' },
                  { label: 'Extra', value: diffData.stats.extraCount, color: '#3b82f6' },
                  { label: 'Score', value: `${diffData.stats.matchScore}%`, color: scoreHex(diffData.stats.matchScore) },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * i, duration: 0.3 }}
                    className="rounded-xl p-3 text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-sm">Failed to load diff data</div>
          )}
        </motion.div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <FeedbackSection atsScore={resumeId?.atsScore} />
      )}

      {/* Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4" style={{ animation: 'slideUp 0.3s ease' }}>
          <SkillSection title="Matched Skills" count={matchedSkills.length} skills={matchedSkills}
            icon={<FiCheckCircle className="text-green-400 w-4 h-4" />} color="green" />
          <SkillSection title="Missing Skills" count={missingSkills.length} skills={missingSkills}
            icon={<FiXCircle className="text-red-400 w-4 h-4" />} color="red" />
          {extraSkills.length > 0 && (
            <SkillSection title="Extra Skills" count={extraSkills.length} skills={extraSkills}
              icon={<FiBarChart2 className="text-blue-400 w-4 h-4" />} color="blue" />
          )}
        </div>
      )}

      {/* Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6" style={{ animation: 'slideUp 0.3s ease' }}>

          {/* AI Suggestions — Premium Section */}
          {suggestions?.ai?.length > 0 && (
            <div>
              {/* AI Header Banner */}
              <div className="relative overflow-hidden rounded-2xl p-5 mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(16,185,129,0.06) 100%)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}>
                {/* Animated glow orbs */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15"
                  style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite 1s' }} />

                <div className="relative flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                    <FiCpu className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Gemini AI Insights
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                        Powered by AI
                      </span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {suggestions.ai.length} personalized suggestions generated by analyzing your resume against the job description
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Cards */}
              <div className="space-y-3">
                {suggestions.ai.map((s, i) => {
                  const icons = [<FiTarget />, <FiEdit3 />, <FiLayers />, <FiTrendingUp />, <FiStar />]
                  const colors = [
                    { gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', glow: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.12)', accent: '#60a5fa' },
                    { gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)', glow: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.12)', accent: '#a78bfa' },
                    { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', glow: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.12)', accent: '#34d399' },
                    { gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', glow: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.12)', accent: '#fbbf24' },
                    { gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', glow: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.12)', accent: '#f472b6' },
                  ]
                  const c = colors[i % colors.length]
                  const icon = icons[i % icons.length]
                  const labels = ['Strategic Focus', 'Content Enhancement', 'Structure & Layout', 'Impact & Metrics', 'Competitive Edge']

                  return (
                    <div key={i} className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: `1px solid ${c.border}`,
                        borderLeft: `3px solid ${c.accent}`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${c.glow}`; e.currentTarget.style.borderColor = c.accent + '30' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = c.border }}>

                      {/* Top row: number + label */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                            style={{ background: c.gradient, boxShadow: `0 2px 10px ${c.glow}` }}>
                            <span className="text-xs font-black">{String(i + 1).padStart(2, '0')}</span>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.accent }}>
                            {labels[i % labels.length]}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity"
                          style={{ background: `${c.accent}10`, color: c.accent }}>
                          {icon}
                        </div>
                      </div>

                      {/* Suggestion text */}
                      <p className="text-slate-300 text-sm leading-relaxed pl-[42px]">{s}</p>

                      {/* Bottom progress indicator */}
                      <div className="mt-4 ml-[42px]">
                        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', maxWidth: '120px' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${100 - i * 12}%`, background: c.gradient }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI Summary Footer */}
              <div className="mt-4 rounded-xl p-3.5 flex items-center justify-between"
                style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.08)' }}>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FiTerminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generated by <strong className="text-indigo-400">Gemini 2.5 Flash</strong></span>
                </div>
                <Link to="/analyze" className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <FiRefreshCw className="w-3 h-3" /> Re-analyze
                </Link>
              </div>
            </div>
          )}

          {/* Divider between AI and Rule-based */}
          {suggestions?.ai?.length > 0 && suggestions?.basic?.length > 0 && (
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              <span className="text-[10px] text-slate-700 font-medium uppercase tracking-widest">Also detected</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
            </div>
          )}

          {/* Rule-Based Suggestions — Enhanced */}
          {suggestions?.basic?.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <FiCrosshair className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Pattern-Based Analysis</h3>
                  <p className="text-slate-600 text-[11px]">{suggestions.basic.length} improvements detected from resume patterns</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {suggestions.basic.map((s, i) => {
                  const typeConfig = {
                    weak_verb: { icon: <FiFeather className="w-3.5 h-3.5" />, color: '#f97316', label: 'Weak Verb' },
                    missing_metrics: { icon: <FiPieChart className="w-3.5 h-3.5" />, color: '#eab308', label: 'Missing Metrics' },
                    missing_section: { icon: <FiLayout className="w-3.5 h-3.5" />, color: '#ef4444', label: 'Missing Section' },
                    missing_skills: { icon: <FiTarget className="w-3.5 h-3.5" />, color: '#3b82f6', label: 'Skill Gap' },
                    missing_links: { icon: <FiStar className="w-3.5 h-3.5" />, color: '#8b5cf6', label: 'Missing Links' },
                    too_short: { icon: <FiAlertCircle className="w-3.5 h-3.5" />, color: '#f97316', label: 'Too Short' },
                    missing_contact: { icon: <FiUser className="w-3.5 h-3.5" />, color: '#ef4444', label: 'Contact Info' },
                  }
                  const tc = typeConfig[s.type] || { icon: <FiAlertCircle className="w-3.5 h-3.5" />, color: '#64748b', label: s.type?.replace('_', ' ') || 'Tip' }

                  return (
                    <div key={i} className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${tc.color}25`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}>

                      {/* Colored top accent bar */}
                      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${tc.color}60, transparent)` }} />

                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                            style={{ background: `${tc.color}12`, color: tc.color }}>
                            {tc.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                                style={{ background: `${tc.color}12`, color: tc.color }}>
                                {tc.label}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{s.message}</p>

                            {/* Before/After comparison boxes */}
                            {s.original && (
                              <div className="mt-3 grid md:grid-cols-2 gap-2">
                                <div className="rounded-lg p-3 relative overflow-hidden"
                                  style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)' }}>
                                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: 'rgba(239,68,68,0.3)' }} />
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <FiXCircle className="w-3 h-3 text-red-400/60" />
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Before</p>
                                  </div>
                                  <p className="text-slate-400 text-xs leading-relaxed italic">"{s.original}"</p>
                                </div>
                                {s.improved && (
                                  <div className="rounded-lg p-3 relative overflow-hidden"
                                    style={{ background: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.08)' }}>
                                    <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: 'rgba(34,197,94,0.3)' }} />
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <FiCheckCircle className="w-3 h-3 text-green-400/60" />
                                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">After</p>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-relaxed">"{s.improved}"</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* No AI suggestions notice */}
          {!suggestions?.ai?.length && suggestions?.basic?.length > 0 && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(124,58,237,0.03))', border: '1px solid rgba(99,102,241,0.1)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(99,102,241,0.1)' }}>
                <FiCpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400"><strong className="text-indigo-400">AI Suggestions</strong> were not enabled for this analysis.</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Re-run with the AI toggle on for 5 personalized Gemini-powered insights.</p>
              </div>
              <Link to="/analyze" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1">
                Try Now <FiZap className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Empty state */}
          {!suggestions?.basic?.length && !suggestions?.ai?.length && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(16,185,129,0.04))', border: '1px solid rgba(34,197,94,0.1)' }}>
                <FiCheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-white font-semibold text-sm">Looking great!</p>
              <p className="text-slate-600 text-xs mt-1.5 max-w-xs mx-auto">No suggestions needed — your resume is well-optimized for this role.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ Optimize Tab ═══ */}
      {activeTab === 'optimize' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">
          {!optimizeData ? (
            <div className="text-center py-16">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
                <FiCpu className="w-9 h-9 text-indigo-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Auto-Optimize with AI</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Gemini AI will rewrite your resume to better match this job — stronger bullets,
                targeted keywords, optimized structure. Your existing experience stays truthful.
              </p>
              <button onClick={handleOptimize} disabled={optimizeLoading}
                className="btn-primary text-base px-10 py-3.5 mx-auto">
                {optimizeLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
                    <span>Optimizing with Gemini...</span>
                  </>
                ) : (
                  <><FiZap className="w-4 h-4" /> <span>Optimize My Resume</span></>
                )}
              </button>
              <p className="text-slate-700 text-xs mt-4">Takes about 15-30 seconds</p>
            </div>
          ) : (
            <>
              {/* Optimize header */}
              <div className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.06) 100%)',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
                      <FiCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Resume Optimized!
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                          AI Enhanced
                        </span>
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {optimizeData.missingSkillsAddressed?.length || 0} missing skills addressed · {optimizeData.changelog?.length || 0} changes made
                      </p>
                    </div>
                  </div>
                  <button onClick={handleDownloadPDF} disabled={pdfLoading}
                    className="btn-primary py-2.5 px-5 text-sm shrink-0">
                    {pdfLoading ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} /> Generating...</>
                    ) : (
                      <><FiDownload className="w-4 h-4" /> <span>Download PDF</span></>
                    )}
                  </button>
                </div>
              </div>

              {/* Changelog */}
              {optimizeData.changelog?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-emerald-400" /> What Changed
                  </h3>
                  <div className="space-y-2">
                    {optimizeData.changelog.map((change, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}
                        className="flex items-start gap-2.5 text-xs text-slate-400">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>{i + 1}</span>
                        {change}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills addressed */}
              {optimizeData.missingSkillsAddressed?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <FiTarget className="w-4 h-4 text-blue-400" /> Missing Skills Addressed
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizeData.missingSkillsAddressed.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#86efac' }}>
                        <FiCheckCircle className="w-3 h-3 inline mr-1" />{skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimized Resume Preview */}
              <div className="card">
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FiEdit3 className="w-4 h-4 text-violet-400" /> Optimized Resume
                  </h3>
                  <button onClick={handleDownloadPDF} disabled={pdfLoading}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    <FiDownload className="w-3 h-3" /> Download
                  </button>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto pr-2 whitespace-pre-wrap" style={{ scrollbarWidth: 'thin' }}>
                  {optimizeData.text}
                </div>
              </div>

              {/* Re-optimize */}
              <button onClick={handleOptimize} disabled={optimizeLoading}
                className="btn-secondary py-2.5 px-6 text-sm mx-auto">
                {optimizeLoading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} /> Re-optimizing...</>
                ) : (
                  <><FiRefreshCw className="w-3.5 h-3.5" /> Re-optimize</>
                )}
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3" style={{ animation: 'slideUp 0.3s ease' }}>
          {roadmap?.length > 0 ? (
            <>
              <div className="rounded-xl p-3.5 text-xs flex items-center gap-2"
                style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)', color: '#93c5fd' }}>
                <FiBookOpen className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Skill Gap Roadmap</strong> — Learn these {roadmap.length} skill{roadmap.length > 1 ? 's' : ''} to better match this role.</span>
              </div>
              {roadmap.map((item, i) => (
                <div key={i} className="card">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{item.skill}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${getLevelBadge(item.level)}`}>{item.level}</span>
                        <span className="flex items-center gap-1 text-slate-600 text-xs">
                          <FiClock className="w-3 h-3" /> {item.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-black shrink-0" style={{ color: 'rgba(255,255,255,0.04)' }}>#{i + 1}</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Topics</p>
                      <ul className="space-y-1.5">
                        {item.topics.map((t, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                              style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{j + 1}</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Resources</p>
                      <ul className="space-y-1.5">
                        {item.resources.map((r, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                            <FiBookOpen className="text-violet-400 w-3.5 h-3.5 shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(34,197,94,0.06)' }}>
                <FiCheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-slate-300 font-medium text-sm">No skill gaps found!</p>
              <p className="text-slate-600 text-xs mt-1">Your skills match the job requirements well.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FeedbackSection({ atsScore }) {
  if (!atsScore) return (
    <div className="text-center py-14">
      <p className="text-slate-500 text-sm">No ATS data available</p>
    </div>
  )

  const { feedback = [], strengths = [], total = 0, grade, breakdown } = atsScore

  // Support both old string format and new object format for feedback
  const feedbackItems = feedback.map(f => typeof f === 'string' ? { text: f, priority: 'medium', category: 'general' } : f)

  const highPriority = feedbackItems.filter(f => f.priority === 'high')
  const mediumPriority = feedbackItems.filter(f => f.priority === 'medium')
  const lowPriority = feedbackItems.filter(f => f.priority === 'low')

  const categoryIcons = {
    keywords: <FiHash className="w-3.5 h-3.5" />,
    structure: <FiLayout className="w-3.5 h-3.5" />,
    language: <FiEdit3 className="w-3.5 h-3.5" />,
    impact: <FiTrendingUp className="w-3.5 h-3.5" />,
    formatting: <FiLayout className="w-3.5 h-3.5" />,
    contact: <FiUser className="w-3.5 h-3.5" />,
    general: <FiAlertCircle className="w-3.5 h-3.5" />,
  }

  const priorityConfig = {
    high: { label: 'High Priority', color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', glow: 'rgba(239,68,68,0.08)' },
    medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.12)', glow: 'rgba(234,179,8,0.06)' },
    low: { label: 'Low', color: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.12)', glow: 'rgba(100,116,139,0.04)' },
  }

  return (
    <div className="space-y-5" style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Score + Grade Header */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 rounded-2xl p-5 text-center"
          style={{ background: `${scoreColor(total)}08`, border: `1px solid ${scoreColor(total)}18` }}>
          <div className="text-4xl font-black" style={{ color: scoreColor(total) }}>{total}%</div>
          <div className="text-slate-500 text-xs mt-1">ATS Score</div>
          {grade && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold"
              style={{ background: `${scoreColor(total)}15`, color: scoreColor(total) }}>
              <FiAward className="w-3.5 h-3.5" /> Grade {grade}
            </div>
          )}
          <div className="mt-3 text-xs text-slate-600">
            {total >= 85 ? 'Excellent — ATS-optimized' : total >= 70 ? 'Good — minor improvements needed' : total >= 55 ? 'Fair — several areas to improve' : total >= 40 ? 'Needs work — significant gaps' : 'Critical — major overhaul needed'}
          </div>
        </div>

        {/* Breakdown mini-bars */}
        <div className="md:col-span-2 card">
          <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <FiBarChart2 className="w-4 h-4 text-blue-400" /> Score Breakdown
          </h3>
          {breakdown && (
            <div className="space-y-2.5">
              {Object.entries(breakdown).map(([key, val]) => {
                const max = getMax(key)
                const pct = (val / max) * 100
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        {getCategoryIcon(key)} {formatKey(key)}
                      </span>
                      <span className="font-semibold" style={{ color: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }}>{val}/{max}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="card" style={{ borderColor: 'rgba(34,197,94,0.1)' }}>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <FiShield className="text-green-400 w-3.5 h-3.5" />
            </div>
            <span className="text-green-400">What's Working Well</span>
            <span className="text-slate-600 font-normal text-xs">({strengths.length})</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg"
                style={{ background: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.08)' }}>
                <FiCheckCircle className="text-green-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements by Priority */}
      {feedbackItems.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <FiTarget className="text-amber-400 w-3.5 h-3.5" />
            </div>
            <span className="text-white">Areas to Improve</span>
            <span className="text-slate-600 font-normal text-xs">({feedbackItems.length})</span>
          </h3>

          {[
            { items: highPriority, config: priorityConfig.high },
            { items: mediumPriority, config: priorityConfig.medium },
            { items: lowPriority, config: priorityConfig.low },
          ].filter(g => g.items.length > 0).map(({ items, config }) => (
            <div key={config.label} className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>{config.label}</span>
              </div>
              {items.map((item, i) => (
                <div key={i} className="rounded-xl p-4 transition-all duration-200"
                  style={{ background: config.bg, border: `1px solid ${config.border}`, borderLeft: `3px solid ${config.color}40` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${config.glow}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${config.color}15`, color: config.color }}>
                      {categoryIcons[item.category] || categoryIcons.general}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: `${config.color}12`, color: config.color }}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-10">
          <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <p className="text-white font-medium text-sm">No issues found!</p>
          <p className="text-slate-600 text-xs mt-1">Your resume is well-optimized for ATS systems.</p>
        </div>
      )}
    </div>
  )
}

function scoreColor(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function getCategoryIcon(key) {
  const map = {
    keywordMatch: <FiHash className="w-3 h-3 text-blue-400" />,
    sectionCompleteness: <FiLayout className="w-3 h-3 text-violet-400" />,
    actionVerbs: <FiEdit3 className="w-3 h-3 text-amber-400" />,
    measurableMetrics: <FiTrendingUp className="w-3 h-3 text-green-400" />,
    formattingRules: <FiShield className="w-3 h-3 text-cyan-400" />,
  }
  return map[key] || null
}

function SkillSection({ title, count, skills, icon, color }) {
  const colorMap = {
    green: { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)', text: '#86efac' },
    red: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', text: '#fca5a5' },
    blue: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', text: '#93c5fd' },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className="card">
      <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
        {icon}
        <span>{title}</span>
        <span className="text-slate-600 font-normal text-xs">({count})</span>
      </h3>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => (
            <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-700 text-xs italic">None</p>
      )}
    </div>
  )
}

function formatKey(key) {
  const map = { keywordMatch: 'Keywords', sectionCompleteness: 'Sections', actionVerbs: 'Action Verbs', measurableMetrics: 'Metrics', formattingRules: 'Formatting' }
  return map[key] || key
}

function getMax(key) {
  const map = { keywordMatch: 40, sectionCompleteness: 20, actionVerbs: 15, measurableMetrics: 15, formattingRules: 10 }
  return map[key] || 100
}

function getSuggestionBadge(type) {
  const map = {
    weak_verb: 'bg-orange-500/10 text-orange-400',
    missing_metrics: 'bg-yellow-500/10 text-yellow-400',
    missing_section: 'bg-red-500/10 text-red-400',
    missing_skills: 'bg-blue-500/10 text-blue-400',
    missing_links: 'bg-violet-500/10 text-violet-400',
    too_short: 'bg-orange-500/10 text-orange-400',
  }
  return map[type] || 'bg-slate-800 text-slate-400'
}

function getLevelBadge(level) {
  const map = {
    beginner: 'bg-green-500/10 text-green-400',
    intermediate: 'bg-yellow-500/10 text-yellow-400',
    advanced: 'bg-red-500/10 text-red-400',
  }
  return map[level] || 'bg-slate-800 text-slate-400'
}

/**
 * Renders text with colored highlight spans based on backend highlight data
 */
function HighlightedText({ text, highlights }) {
  if (!text || !highlights || highlights.length === 0) return <span>{text}</span>

  const colorMap = {
    matched: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', color: '#86efac' },
    missing: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' },
    weak_verb: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', color: '#fde68a' },
    metric: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', color: '#93c5fd' },
    preferred: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', color: '#c4b5fd' },
  }

  const parts = []
  let lastIdx = 0

  // Sort highlights by start position
  const sorted = [...highlights].sort((a, b) => a.start - b.start)

  for (const h of sorted) {
    if (h.start > lastIdx) {
      parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx, h.start)}</span>)
    }
    if (h.start >= lastIdx) {
      const c = colorMap[h.type] || colorMap.matched
      parts.push(
        <span key={`h-${h.start}`} title={h.label}
          style={{ background: c.bg, borderBottom: `2px solid ${c.border}`, color: c.color, padding: '1px 3px', borderRadius: '3px', cursor: 'default' }}>
          {text.slice(h.start, h.end)}
        </span>
      )
      lastIdx = h.end
    }
  }

  if (lastIdx < text.length) {
    parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx)}</span>)
  }

  return <>{parts}</>
}
