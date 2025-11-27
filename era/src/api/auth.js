// src/api/auth.js
import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://event-reminder-backend-p0gb.onrender.com'
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);

export default API;
