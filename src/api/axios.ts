import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobrixa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Keep backend warm — ping every 14 minutes to prevent Render cold starts
if (import.meta.env.PROD) {
  setInterval(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/auth/ping`)
      .catch(() => {}); // silently ignore errors
  }, 14 * 60 * 1000);
}

export default api;
