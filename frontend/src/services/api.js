import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
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

export default API