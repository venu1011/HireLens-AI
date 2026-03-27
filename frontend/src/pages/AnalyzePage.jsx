import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-main tracking-tighter">Analyze Resume</h1>
        <p className="text-muted text-base mt-2 font-bold">Match your resume against any job description with AI precision.</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-3 shrink-0">
            <button onClick={() => { if (s < step) setStep(s) }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 border"
              style={{
                background: step >= s ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : 'var(--bg-card)',
                color: step >= s ? '#fff' : 'var(--text-muted)',
                borderColor: step >= s ? 'transparent' : 'var(--border-main)',
                cursor: s < step ? 'pointer' : 'default',
                boxShadow: step >= s ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : 'none'
              }}>
              {step > s ? <FiCheck className="w-4 h-4" /> : s}
            </button>
            <span className={`text-xs font-black uppercase tracking-widest ${step === s ? 'text-blue-600 dark:text-blue-400' : 'text-muted opacity-50'}`}>
              {s === 1 ? 'Resume' : s === 2 ? 'Target' : 'Execute'}
            </span>
            {s < 3 && <div className="w-10 h-0.5 rounded-full bg-slate-500/10" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-black text-main mb-2">Select or Upload Resume</h2>
            <p className="text-muted text-sm mb-8 font-bold">Upload a new PDF or choose an existing document from your history.</p>

            {/* Dropzone */}
            <div
              className={`rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${dragActive ? 'bg-blue-500/10 border-blue-500' : 'bg-app/30 border-main hover:border-blue-500/50'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10">
                    <FiCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <p className="text-main font-black text-lg truncate max-w-xs">{file.name}</p>
                  <p className="text-muted text-xs font-bold uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB · PDF DOCUMENT</p>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="btn-secondary py-2 px-6 text-xs mt-2 border-red-500/20 text-red-500 hover:bg-red-500/5">
                    <FiX /> Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FiUploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-main font-black text-lg">Drop your resume here.</p>
                    <p className="text-muted text-sm font-bold">PDF format accepted, up to 10MB.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Existing resumes */}
            {resumes.length > 0 && (
              <div className="mt-10">
                <p className="text-xs text-muted font-black uppercase tracking-widest mb-4">Or select from library</p>
                <div className="grid gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  {resumes.map(r => (
                    <button key={r._id} onClick={() => selectResume(r._id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${selectedResumeId === r._id ? 'bg-blue-500/5 border-blue-500 shadow-lg shadow-blue-500/5' : 'bg-app/20 border-main hover:border-slate-400'}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedResumeId === r._id ? 'bg-blue-500/20 text-blue-600' : 'bg-slate-500/10 text-muted'}`}>
                          <FiFileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-black truncate ${selectedResumeId === r._id ? 'text-blue-600 dark:text-blue-400' : 'text-main'}`}>{r.fileName}</p>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">v{r.version} · ATS {r.atsScore.total}%</p>
                        </div>
                      </div>
                      {selectedResumeId === r._id && <FiCheck className="text-blue-600 dark:text-blue-400 w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button disabled={!hasResume}
              onClick={() => setStep(2)}
              className="btn-primary w-full mt-10 shadow-lg shadow-blue-500/20 disabled:opacity-30">
              <span>Next Phase</span> <FiArrowRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-black text-main mb-2">Target Job Requirements</h2>
            <p className="text-muted text-sm mb-8 font-bold">Paste the full job posting text below for alias-aware analysis.</p>

            <div className="relative group">
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the requirements here..."
                rows={12}
                className="input-field min-h-[300px] resize-none font-bold"
              />
              <div className="absolute bottom-4 right-6 text-[10px] font-black text-muted uppercase tracking-widest">{jobDescription.length} characters</div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)}
                className="btn-secondary flex-1">
                <FiArrowLeft /> Back
              </button>
              <button disabled={!jobDescription.trim()}
                onClick={() => setStep(3)}
                className="btn-primary flex-[2]">
                <span>Analyze Sync</span> <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-black text-main mb-2">Final Validation</h2>
            <p className="text-muted text-sm mb-8 font-bold">Review analysis parameters before initiating deep scan.</p>

            <div className="grid gap-4 mb-8">
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-app/50 border border-main">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center"><FiFileText className="text-blue-500 w-6 h-6"/></div>
                <div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest">Selected Resource</p>
                   <p className="text-main font-black truncate max-w-xs">{file ? file.name : resumes.find(r => r._id === selectedResumeId)?.fileName || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-app/50 border border-main">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center"><FiBriefcase className="text-violet-500 w-6 h-6"/></div>
                <div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest">Requirement Scope</p>
                   <p className="text-main font-black">{jobDescription.length} Character Context</p>
                </div>
              </div>
            </div>

            {/* AI toggle */}
            <div className="rounded-[2rem] p-6 flex items-center justify-between bg-blue-500/5 border border-blue-500/20 mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${useAI ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-500/10 text-muted'}`}>
                  <FiZap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-black text-main">AI-Guided Analysis</p>
                  <p className="text-xs text-muted font-bold">Activates NVIDIA NIM for suggestion generation.</p>
                </div>
              </div>
              <button onClick={() => setUseAI(!useAI)} className="text-3xl transition-transform active:scale-90">
                {useAI ? <FiToggleRight className="text-blue-600" /> : <FiToggleLeft className="text-muted" />}
              </button>
            </div>

            {loading && (
              <div className="mt-8 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2.5">
                  <span className="text-blue-600 animate-pulse">Scanning Core Sections...</span>
                  <span className="text-main">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-500/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} disabled={loading}
                className="btn-secondary flex-1 disabled:opacity-30">
                <FiArrowLeft /> Back
              </button>
              <button onClick={analyze} disabled={loading}
                className="btn-primary flex-[2] text-xl py-5 disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Deep Analyzing...
                  </span>
                ) : (
                  <><span>Initiate Deep Scan</span><FiZap /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
