import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hirelens_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hirelens_token')
      localStorage.removeItem('hirelens_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ───────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
}

// ─── Resume ─────────────────────────────────────────────
export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  getAll: () => API.get('/resume'),
  getOne: (id) => API.get(`/resume/${id}`),
  delete: (id) => API.delete(`/resume/${id}`),
  getHistory: () => API.get('/resume/history')
}

// ─── Analysis ────────────────────────────────────────────
export const analysisAPI = {
  analyze: (data) => API.post('/analysis/analyze', data, { timeout: 60000 }),
  getAll: () => API.get('/analysis'),
  getOne: (id) => API.get(`/analysis/${id}`),
  delete: (id) => API.delete(`/analysis/${id}`)
}

export default API
