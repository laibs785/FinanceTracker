import axios from 'axios';

// ✅ Fixed: No spaces in baseURL
const API = axios.create({
  baseURL: 'https://financetracker-production-529c.up.railway.app/api', // ✅ Correct
  withCredentials: false,
});

// Add Authorization header if token exists in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;