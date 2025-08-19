// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // ✅ Correct: points to your backend
  withCredentials: false, // ✅ Fine for JWT (we send token in headers)
});

// Interceptor: Add token to every request if user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Correct format
  }
  return config;
});

export default API;