import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiUpload, FiFileText, FiZap, FiCheck, FiArrowRight, FiArrowLeft, FiCpu } from 'react-icons/fi'

const STEPS = ['Upload Resume', 'Job Description', 'Analyze']

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [resumes, setResumes] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [uploadMode, setUploadMode] = useState('upload')
  const [jobDesc, setJobDesc] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [useAI, setUseAI] = useState(true)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    resumeAPI.getAll().then(res => setResumes(res.data.resumes || [])).catch(() => {})
  }, [])

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files[0] || e.target.files[0]
    if (file && file.type === 'application/pdf') setSelectedFile(file)
    else toast.error('Please upload a PDF file')
  }

  const handleUploadResume = async () => {
    if (!selectedFile) return toast.error('Please select a PDF file')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)
      const res = await resumeAPI.upload(formData)
      setSelectedResumeId(res.data.resume._id)
      toast.success(`Resume uploaded! ATS Score: ${res.data.resume.atsScore.total}%`)
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleUseExisting = () => {
    if (!selectedResumeId) return toast.error('Please select a resume')
    setStep(2)
  }

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) return toast.error('Please enter a job description')
    if (!selectedResumeId) return toast.error('No resume selected')
    setLoading(true)
    try {
      const res = await analysisAPI.analyze({
        resumeId: selectedResumeId,
        jobDescription: jobDesc,
        jobTitle: jobTitle || 'Job Analysis',
        useAI
      })
      toast.success('Analysis complete!')
      navigate(`/analysis/${res.data.analysis._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        {STEPS.map((label, i) => {
          const done = step > i + 1
          const active = step === i + 1
          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={
                    done ? { background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 16px rgba(16,185,129,0.4)' } :
                    active ? { background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' } :
                    { background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }
                  }
                >
                  {done ? <FiCheck className="w-4 h-4 text-white" /> : <span className="text-white">{i + 1}</span>}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-white' : done ? 'text-green-400' : 'text-slate-600'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px mx-3 rounded-full transition-all duration-500"
                  style={{ background: done ? 'linear-gradient(90deg,#10b981,#3b82f6)' : 'rgba(51,65,85,0.5)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="card animate-slide-up">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Select Your Resume</h2>
            <p className="text-slate-400 text-sm">Upload a new PDF or use a previously uploaded resume</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)' }}>
            {[
              { id: 'upload', label: 'Upload New PDF' },
              { id: 'existing', label: `Use Existing${resumes.length > 0 ? ` (${resumes.length})` : ''}`, disabled: resumes.length === 0 }
            ].map(m => (
              <button key={m.id} disabled={m.disabled}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${m.disabled ? 'opacity-40 cursor-not-allowed text-slate-500' : uploadMode === m.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                style={uploadMode === m.id ? { background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(124,58,237,0.15))', border: '1px solid rgba(59,130,246,0.3)' } : {}}
                onClick={() => !m.disabled && setUploadMode(m.id)}
              >{m.label}</button>
            ))}
          </div>

          {uploadMode === 'upload' ? (
            <>
              <label
                className="flex flex-col items-center justify-center w-full h-52 rounded-2xl cursor-pointer transition-all duration-300"
                style={{
                  border: `2px dashed ${dragging ? 'rgba(59,130,246,0.7)' : selectedFile ? 'rgba(16,185,129,0.5)' : 'rgba(51,65,85,0.6)'}`,
                  background: dragging ? 'rgba(59,130,246,0.05)' : selectedFile ? 'rgba(16,185,129,0.04)' : 'rgba(15,23,42,0.4)',
                }}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
              >
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileDrop} />
                {selectedFile ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <FiFileText className="w-7 h-7 text-green-400" />
                    </div>
                    <p className="text-green-400 font-semibold max-w-xs truncate px-4">{selectedFile.name}</p>
                    <p className="text-slate-500 text-sm mt-1">{(selectedFile.size / 1024).toFixed(0)} KB · Click to change</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <FiUpload className="w-7 h-7 text-blue-400" />
                    </div>
                    <p className="text-slate-200 font-semibold">Drag & drop or click to upload</p>
                    <p className="text-slate-500 text-sm mt-1">PDF files only · Max 5MB</p>
                  </>
                )}
              </label>
              <button onClick={handleUploadResume} disabled={!selectedFile || loading} className="btn-primary w-full mt-4 py-3 text-base">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiUpload /> Upload & Parse Resume</>}
              </button>
            </>
          ) : (
            <div className="space-y-2.5">
              {resumes.map(r => (
                <label key={r._id}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: selectedResumeId === r._id ? 'rgba(59,130,246,0.08)' : 'rgba(15,23,42,0.5)',
                    border: `1px solid ${selectedResumeId === r._id ? 'rgba(59,130,246,0.4)' : 'rgba(51,65,85,0.45)'}`,
                  }}
                >
                  <input type="radio" name="resume" value={r._id} checked={selectedResumeId === r._id}
                    onChange={() => setSelectedResumeId(r._id)} className="accent-blue-500" />
                  <FiFileText className="text-blue-400 w-5 h-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-sm">{r.fileName}</p>
                    <p className="text-slate-500 text-xs">v{r.version} · ATS: {r.atsScore.total}% · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${r.atsScore.total >= 70 ? 'text-green-400' : r.atsScore.total >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {r.atsScore.total}%
                  </span>
                </label>
              ))}
              <button onClick={handleUseExisting} disabled={!selectedResumeId} className="btn-primary w-full mt-2 py-3">
                Continue <FiArrowRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card animate-slide-up">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Paste Job Description</h2>
            <p className="text-slate-400 text-sm">Copy and paste the full job description for the role you're targeting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Job Title <span className="text-slate-600 font-normal">(optional)</span></label>
              <input type="text" className="input-field" placeholder="e.g. Full Stack Developer at Google"
                value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            </div>

            <div>
              <label className="label">Job Description <span className="text-red-400">*</span></label>
              <textarea className="input-field resize-none" style={{ height: '220px' }}
                placeholder={"Paste the full job description here...\n\nInclude requirements, qualifications, skills needed, and responsibilities."}
                value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              />
              <p className="text-slate-600 text-xs mt-1.5 flex items-center gap-1">
                <span>{jobDesc.split(/\s+/).filter(Boolean).length} words</span>
                <span>·</span>
                <span>More context = better analysis</span>
              </p>
            </div>

            {/* AI Toggle */}
            <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: useAI ? 'rgba(245,158,11,0.06)' : 'rgba(15,23,42,0.5)', border: `1px solid ${useAI ? 'rgba(245,158,11,0.3)' : 'rgba(51,65,85,0.45)'}` }}>
              <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} className="mt-0.5 accent-yellow-500" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <FiCpu className="text-yellow-400 w-4 h-4" />
                  <span className="text-white font-semibold text-sm">Enable Gemini AI Suggestions</span>
                  <span className="badge badge-orange">AI</span>
                </div>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  Uses Google Gemini to generate tailored improvement suggestions and rewrite weak bullet points.
                </p>
              </div>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="btn-secondary flex-none px-5">
                <FiArrowLeft /> Back
              </button>
              <button onClick={handleAnalyze} disabled={!jobDesc.trim() || loading} className="btn-primary flex-1 py-3 text-base">
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  : <><FiZap /> Analyze Resume</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
