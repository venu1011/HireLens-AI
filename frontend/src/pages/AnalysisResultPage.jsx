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
    { id: 'skills', label: 'Skills', icon: <FiCheckCircle className="w-3.5 h-3.5" /> },
    { id: 'suggestions', label: 'Suggestions', icon: <FiZap className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <FiBookOpen className="w-3.5 h-3.5" /> },
  ]

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
        <div className="grid md:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.3s ease' }}>
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
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {resumeId?.atsScore?.feedback?.length > 0 && (
              <div className="mt-4 space-y-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Feedback</p>
                {resumeId.atsScore.feedback.map((f, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-400">
                    <FiAlertCircle className="text-amber-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
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
        <div className="space-y-5" style={{ animation: 'slideUp 0.3s ease' }}>
          {suggestions?.basic?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <FiAlertCircle className="text-amber-500 w-3.5 h-3.5" /> Rule-Based Suggestions
              </h3>
              <div className="space-y-2.5">
                {suggestions.basic.map((s, i) => (
                  <div key={i} className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderLeft: '3px solid rgba(245,158,11,0.4)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${getSuggestionBadge(s.type)}`}>
                        {s.type?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{s.message}</p>
                    {s.original && (
                      <div className="mt-3 grid md:grid-cols-2 gap-2">
                        <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                          <p className="text-[10px] text-red-400 font-semibold mb-1">Before</p>
                          <p className="text-slate-400 text-xs leading-relaxed">{s.original}</p>
                        </div>
                        {s.improved && (
                          <div className="rounded-lg p-3" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
                            <p className="text-[10px] text-green-400 font-semibold mb-1">After</p>
                            <p className="text-slate-400 text-xs leading-relaxed">{s.improved}</p>
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
              <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <FiCpu className="text-blue-400 w-3.5 h-3.5" /> Gemini AI Suggestions
              </h3>
              <div className="space-y-2.5">
                {suggestions.ai.map((s, i) => (
                  <div key={i} className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderLeft: '3px solid rgba(59,130,246,0.3)' }}>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>{i + 1}</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!suggestions?.ai?.length && (
            <div className="rounded-xl p-3.5 text-xs flex items-center gap-3"
              style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', color: '#fbbf24' }}>
              <FiCpu className="w-3.5 h-3.5 shrink-0" />
              <span><strong>AI Suggestions</strong> were not enabled. Re-run on the <Link to="/analyze" className="underline">Analyze page</Link> with the AI toggle on.</span>
            </div>
          )}

          {!suggestions?.basic?.length && !suggestions?.ai?.length && (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <FiZap className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-slate-400 font-medium text-sm">No suggestions generated</p>
              <p className="text-slate-600 text-xs mt-1">Your resume looks well-optimized!</p>
            </div>
          )}
        </div>
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
