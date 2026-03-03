import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiAlertCircle, FiBookOpen, FiZap, FiClock, FiBarChart2, FiCpu } from 'react-icons/fi'
import SkillMatchChart from '../components/Charts/SkillMatchChart'
import RadarMatchChart from '../components/Charts/RadarMatchChart'

export default function AnalysisResultPage() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    analysisAPI.getOne(id)
      .then(res => setAnalysis(res.data.analysis))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading analysis...</p>
    </div>
  )

  if (!analysis) return (
    <div className="text-center py-20 text-slate-400">Analysis not found</div>
  )

  const { matchScore, matchedSkills = [], missingSkills = [], extraSkills = [], suggestions = {}, roadmap = [], resumeId } = analysis

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <FiCheckCircle className="w-4 h-4" /> },
    { id: 'suggestions', label: 'Suggestions', icon: <FiZap className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <FiBookOpen className="w-4 h-4" /> },
  ]

  const scoreColor = (s) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/history"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)' }}>
          <FiArrowLeft className="w-4 h-4 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{analysis.jobTitle || 'Analysis Result'}</h1>
          <p className="text-slate-500 text-sm">{new Date(analysis.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Score Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Match Score', value: `${matchScore}%`, score: matchScore },
          { label: 'ATS Score', value: `${resumeId?.atsScore?.total || 0}%`, score: resumeId?.atsScore?.total || 0 },
          { label: 'Matched Skills', value: matchedSkills.length, color: '#10b981' },
          { label: 'Missing Skills', value: missingSkills.length, color: '#ef4444' },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(15,23,42,0.7)',
              border: `1px solid ${c.score !== undefined ? scoreColor(c.score) + '25' : c.color + '25'}`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 0 25px ${(c.score !== undefined ? scoreColor(c.score) : c.color)}12`
            }}>
            <div className="text-3xl font-bold" style={{ color: c.score !== undefined ? scoreColor(c.score) : c.color }}>{c.value}</div>
            <div className="text-slate-500 text-xs mt-1 font-medium">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
        style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center"
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(124,58,237,0.15))',
              color: '#fff',
              border: '1px solid rgba(59,130,246,0.3)',
              boxShadow: '0 0 16px rgba(59,130,246,0.15)'
            } : { color: '#94a3b8' }}
          >{tab.icon} {tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-5 animate-fade-in">
          <div className="card">
            <h3 className="font-semibold text-white mb-4">Skill Match Distribution</h3>
            <SkillMatchChart matched={matchedSkills.length} missing={missingSkills.length} extra={extraSkills.length} />
          </div>
          <div className="card">
            <h3 className="font-semibold text-white mb-4">ATS Score Breakdown</h3>
            {resumeId?.atsScore?.breakdown && (
              <div className="space-y-3">
                {Object.entries(resumeId.atsScore.breakdown).map(([key, val]) => {
                  const max = getMax(key)
                  const pct = (val / max) * 100
                  const clr = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>{formatKey(key)}</span>
                        <span className="font-semibold text-white">{val}/{max}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(51,65,85,0.5)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: clr }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {resumeId?.atsScore?.feedback?.length > 0 && (
              <div className="mt-5 space-y-2 pt-4" style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Feedback</p>
                {resumeId.atsScore.feedback.map((f, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <FiAlertCircle className="text-yellow-400 w-4 h-4 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-5 animate-fade-in">
          <SkillSection title="Matched Skills" count={matchedSkills.length} skills={matchedSkills}
            icon={<FiCheckCircle className="text-green-400 w-4 h-4" />}
            chipStyle="bg-green-500/12 text-green-300 border border-green-500/25" />
          <SkillSection title="Missing Skills" count={missingSkills.length} skills={missingSkills}
            icon={<FiXCircle className="text-red-400 w-4 h-4" />}
            chipStyle="bg-red-500/12 text-red-300 border border-red-500/25" />
          {extraSkills.length > 0 && (
            <SkillSection title="Extra Skills (not in JD)" count={extraSkills.length} skills={extraSkills}
              icon={<FiBarChart2 className="text-blue-400 w-4 h-4" />}
              chipStyle="bg-blue-500/12 text-blue-300 border border-blue-500/25" />
          )}
        </div>
      )}

      {/* Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-5 animate-fade-in">
          {suggestions?.basic?.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400">
                <FiAlertCircle className="text-yellow-400" /> Rule-Based Suggestions
              </h3>
              <div className="space-y-3">
                {suggestions.basic.map((s, i) => (
                  <div key={i} className="rounded-2xl p-5 transition-all"
                    style={{ background: 'rgba(15,23,42,0.7)', borderLeft: '3px solid rgba(245,158,11,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge border text-xs ${getSuggestionBadge(s.type)}`}>{s.type?.replace('_', ' ')}</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{s.message}</p>
                    {s.original && (
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <p className="text-xs text-red-400 font-semibold mb-1.5">Before</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{s.original}</p>
                        </div>
                        {s.improved && (
                          <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <p className="text-xs text-green-400 font-semibold mb-1.5">After</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{s.improved}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions?.ai?.length > 0 && (
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-slate-400">
                <FiCpu className="text-blue-400" /> Gemini AI Suggestions
              </h3>
              <div className="space-y-3">
                {suggestions.ai.map((s, i) => (
                  <div key={i} className="rounded-2xl p-5"
                    style={{ background: 'rgba(15,23,42,0.7)', borderLeft: '3px solid rgba(59,130,246,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>{i + 1}</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!suggestions?.ai?.length && (
            <div className="rounded-2xl p-4 text-sm flex items-center gap-3"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: '#fbbf24' }}>
              <FiCpu className="w-4 h-4 shrink-0" />
              <span><strong>Gemini AI Suggestions</strong> were not enabled for this analysis. Re-run on the <Link to="/analyze" style={{ textDecoration: 'underline' }}>Analyze page</Link> with the Gemini AI toggle on to get AI-powered tips.</span>
            </div>
          )}

          {!suggestions?.basic?.length && !suggestions?.ai?.length && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(51,65,85,0.3)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <FiZap className="w-7 h-7 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No suggestions generated</p>
              <p className="text-slate-600 text-sm mt-1">Your resume looks well-optimized!</p>
            </div>
          )}
        </div>
      )}

      {/* Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4 animate-fade-in">
          {roadmap?.length > 0 ? (
            <>
              <div className="rounded-2xl p-4 text-sm"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                <strong>Skill Gap Roadmap</strong> — Learn these {roadmap.length} skill{roadmap.length > 1 ? 's' : ''} to better match this role.
              </div>
              {roadmap.map((item, i) => (
                <div key={i} className="card">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.skill}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`badge border text-xs ${getLevelBadge(item.level)}`}>{item.level}</span>
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <FiClock className="w-3 h-3" /> {item.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-800 shrink-0">#{i + 1}</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Topics to Cover</p>
                      <ul className="space-y-2">
                        {item.topics.map((t, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                              style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{j + 1}</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resources</p>
                      <ul className="space-y-2">
                        {item.resources.map((r, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                            <FiBookOpen className="text-violet-400 w-4 h-4 shrink-0 mt-0.5" />
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
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <FiCheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-slate-300 font-semibold">No skill gaps found!</p>
              <p className="text-slate-500 text-sm mt-1">Your skills match the job requirements well.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SkillSection({ title, count, skills, icon, chipStyle }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        {icon}
        <span>{title}</span>
        <span className="text-slate-500 font-normal text-sm">({count})</span>
      </h3>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span key={s} className={`skill-chip ${chipStyle} px-3 py-1.5 text-xs font-medium`}>{s}</span>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 text-sm italic">None</p>
      )}
    </div>
  )
}

function formatKey(key) {
  const map = {
    keywordMatch: 'Keyword Match',
    sectionCompleteness: 'Section Completeness',
    actionVerbs: 'Action Verbs',
    measurableMetrics: 'Measurable Metrics',
    formattingRules: 'Formatting'
  }
  return map[key] || key
}

function getMax(key) {
  const map = { keywordMatch: 40, sectionCompleteness: 20, actionVerbs: 15, measurableMetrics: 15, formattingRules: 10 }
  return map[key] || 100
}

function getSuggestionBadge(type) {
  const map = {
    weak_verb: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    missing_metrics: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    missing_section: 'bg-red-500/10 text-red-400 border-red-500/20',
    missing_skills: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    missing_links: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    too_short: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  }
  return map[type] || 'bg-slate-700 text-slate-400 border-slate-600'
}

function getLevelBadge(level) {
  const map = {
    beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return map[level] || 'bg-slate-700 text-slate-400 border-slate-600'
}
