
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://financetracker-production-529c.up.railway.app/api', 
  withCredentials: false, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  
  }
  return config;
});

export default API;