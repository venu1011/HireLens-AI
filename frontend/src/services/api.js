import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 30000
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
  getAll: () => API.get('/resume'),
  getById: (id) => API.get(`/resume/${id}`),
  delete: (id) => API.delete(`/resume/${id}`),
}

export const analysisAPI = {
  analyze: (data) => API.post('/analysis/analyze', data),
  getAll: () => API.get('/analysis'),
  getOne: (id) => API.get(`/analysis/${id}`),
  delete: (id) => API.delete(`/analysis/${id}`),
  getDiff: (id) => API.get(`/analysis/${id}/diff`),
  optimize: (id) => API.post(`/analysis/${id}/optimize`),
  downloadPDF: (id, data) => API.post(`/analysis/${id}/download-pdf`, data, { responseType: 'blob' }),
}

export default API