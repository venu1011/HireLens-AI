import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 120000 // Increased to 120 seconds to allow AI features enough time to process
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hirelens_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hirelens_token")
      localStorage.removeItem("hirelens_user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
}

export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => API.get('/resume', { params }),
  getById: (id) => API.get(`/resume/${id}`),
  delete: (id) => API.delete(`/resume/${id}`),
}

export const analysisAPI = {
  analyze: (data) => API.post('/analysis/analyze', data),
  getAll: (params) => API.get('/analysis', { params }),
  getOne: (id) => API.get(`/analysis/${id}`),
  delete: (id) => API.delete(`/analysis/${id}`),
  getDiff: (id) => API.get(`/analysis/${id}/diff`),
  optimize: (id) => API.post(`/analysis/${id}/optimize`),
  downloadPDF: (id, data) => API.post(`/analysis/${id}/download-pdf`, data, { responseType: 'blob' }),
  exportAnalysis: (id) => API.get(`/analysis/${id}/export`, { responseType: 'blob' }),
  generateCoverLetter: (id) => API.post(`/analysis/${id}/cover-letter`),
  interviewPrep: (id) => API.post(`/analysis/${id}/interview-prep`),
  updateRoadmapStatus: (id, skillId, data) => API.patch(`/analysis/${id}/roadmap/${skillId}`, data),
}

export default API