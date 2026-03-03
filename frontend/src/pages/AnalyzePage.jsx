import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiUploadCloud, FiFileText, FiCheck, FiBriefcase, FiZap, FiArrowRight, FiArrowLeft, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [resumes, setResumes] = useState([])
  const [file, setFile] = useState(null)
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [useAI, setUseAI] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    resumeAPI.getAll()
      .then(res => setResumes(res.data.resumes || []))
      .catch(() => {})
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') {
      setFile(f)
      setSelectedResumeId(null)
    } else toast.error('Only PDF files are accepted')
  }, [])

  const handleFileInput = (e) => {
    const f = e.target.files[0]
    if (f) { setFile(f); setSelectedResumeId(null) }
  }

  const selectResume = (id) => {
    setSelectedResumeId(id)
    setFile(null)
  }

  const hasResume = file || selectedResumeId

  const analyze = async () => {
    if (!hasResume || !jobDescription.trim()) {
      toast.error('Resume & job description required')
      return
    }
    setLoading(true)
    setProgress(10)
    const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 12, 90)), 400)

    try {
      let resumeId = selectedResumeId
      if (file) {
        const fd = new FormData()
        fd.append('resume', file)
        const uploadRes = await resumeAPI.upload(fd)
        resumeId = uploadRes.data.resume._id
        setProgress(40)
      }

      const analysisRes = await analysisAPI.analyze({
        resumeId,
        jobDescription,
        useAI,
      })
      setProgress(100)
      clearInterval(interval)
      toast.success('Analysis complete!')
      navigate(`/analysis/${analysisRes.data.analysis._id}`)
    } catch (err) {
      clearInterval(interval)
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Analysis failed')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analyze Resume</h1>
        <p className="text-slate-600 text-sm mt-1">Match your resume against any job description</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => { if (s < step) setStep(s) }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: step >= s ? 'linear-gradient(135deg,#3b82f6,#7c3aed)' : 'rgba(255,255,255,0.04)',
                color: step >= s ? '#fff' : 'rgba(255,255,255,0.25)',
                cursor: s < step ? 'pointer' : 'default',
                boxShadow: step >= s ? '0 0 12px rgba(59,130,246,0.2)' : 'none'
              }}>
              {step > s ? <FiCheck className="w-3.5 h-3.5" /> : s}
            </button>
            {s < 3 && <div className="w-16 sm:w-24 h-0.5 rounded-full transition-all duration-500" style={{ background: step > s ? 'linear-gradient(90deg,#3b82f6,#7c3aed)' : 'rgba(255,255,255,0.04)' }} />}
          </div>
        ))}
        <span className="text-xs text-slate-600 ml-2 hidden sm:inline">
          {step === 1 ? 'Select Resume' : step === 2 ? 'Job Description' : 'Confirm & Analyze'}
        </span>
      </div>

      {/* Step content */}
      <div className="card" style={{ animation: 'slideUp 0.3s ease' }}>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Select or Upload Resume</h2>
            <p className="text-slate-600 text-xs mb-6">Upload a new PDF or choose an existing resume</p>

            {/* Dropzone */}
            <div
              className="rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
              style={{
                background: dragActive ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.01)',
                border: `2px dashed ${dragActive ? 'rgba(59,130,246,0.4)' : file ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <FiCheck className="text-green-400 w-5 h-5" />
                  </div>
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-slate-600 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1">
                    <FiX className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <FiUploadCloud className="text-blue-400 w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Drop PDF here or click to browse</p>
                  <p className="text-slate-700 text-xs">PDF only, up to 5MB</p>
                </div>
              )}
            </div>

            {/* Existing resumes */}
            {resumes.length > 0 && (
              <div className="mt-5">
                <p className="text-xs text-slate-600 font-medium mb-3">Or select an existing resume</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
                  {resumes.map(r => (
                    <button key={r._id} onClick={() => selectResume(r._id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: selectedResumeId === r._id ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedResumeId === r._id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)'}`,
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: selectedResumeId === r._id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)' }}>
                        <FiFileText className={`w-3.5 h-3.5 ${selectedResumeId === r._id ? 'text-blue-400' : 'text-slate-600'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${selectedResumeId === r._id ? 'text-blue-400' : 'text-slate-300'}`}>{r.fileName}</p>
                        <p className="text-xs text-slate-700">v{r.version} · ATS {r.atsScore.total}%</p>
                      </div>
                      {selectedResumeId === r._id && <FiCheck className="text-blue-400 w-4 h-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button disabled={!hasResume}
              onClick={() => setStep(2)}
              className="btn-primary w-full mt-6 py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
              <span>Continue</span> <FiArrowRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Paste Job Description</h2>
            <p className="text-slate-600 text-xs mb-6">Copy the full job posting text</p>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full rounded-xl p-4 text-sm resize-none transition-all duration-200 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-700">{jobDescription.length} chars</div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-slate-400 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FiArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button disabled={!jobDescription.trim()}
                onClick={() => setStep(3)}
                className="btn-primary flex-1 py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
                <span>Continue</span> <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Confirm & Analyze</h2>
            <p className="text-slate-600 text-xs mb-6">Review your selections before running analysis</p>

            <div className="space-y-3 mb-6">
              <SummaryRow icon={<FiFileText className="w-4 h-4 text-blue-400" />} label="Resume"
                value={file ? file.name : resumes.find(r => r._id === selectedResumeId)?.fileName || '—'} />
              <SummaryRow icon={<FiBriefcase className="w-4 h-4 text-violet-400" />} label="Job Description"
                value={`${jobDescription.length} characters`} />
            </div>

            {/* AI toggle */}
            <div className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: useAI ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  <FiZap className={`w-4 h-4 ${useAI ? 'text-violet-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI-Powered Suggestions</p>
                  <p className="text-xs text-slate-600">Uses Gemini to generate tailored suggestions</p>
                </div>
              </div>
              <button onClick={() => setUseAI(!useAI)} className="text-2xl transition-colors">
                {useAI ? <FiToggleRight className="text-violet-400" /> : <FiToggleLeft className="text-slate-600" />}
              </button>
            </div>

            {loading && (
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Analyzing...</span>
                  <span className="text-blue-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)' }} />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-slate-400 transition-all duration-200 disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FiArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button onClick={analyze} disabled={loading}
                className="btn-primary flex-1 py-3 text-sm disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
                    Analyzing...
                  </span>
                ) : (
                  <><span>Run Analysis</span><FiZap /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-600 font-medium">{label}</p>
        <p className="text-sm text-white truncate">{value}</p>
      </div>
    </div>
  )
}
