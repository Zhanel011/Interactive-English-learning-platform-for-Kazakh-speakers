import axios from 'axios';

const BACKEND = 'https://interactive-english-learning-platform.onrender.com';

const api = axios.create({ baseURL: `${BACKEND}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const BACKEND_URL = BACKEND;
export default api;