import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore localStorage errors in private browsing
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Critical Guard: On platforms like Vercel or Cloudflare, SPA rewrites can return index.html for unknown /api/* routes.
    // If response data is an HTML string, reject it so callers know the API is not reachable.
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE') || response.data.includes('<html'))) {
      return Promise.reject(new Error('Backend API not reachable: received HTML document instead of JSON.'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch {
          // ignore
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
