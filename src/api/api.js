import axios from 'axios';

// Update the baseURL with full deployed backend URL
const API = axios.create({
baseURL: 'https://financetracker-production-529c.up.railway.app/api', 
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
