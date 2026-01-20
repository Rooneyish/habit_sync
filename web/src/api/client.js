import axios from 'axios';

// Use relative URL for the proxy to work
// client.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Habits API
export const getActiveHabits = async () => {
  const response = await apiClient.get('/habits');
  return response.data;
};

export const getHabit = async (id) => {
  const response = await apiClient.get(`/habits/${id}`);
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await apiClient.post('/habits', habitData);
  return response.data;
};

export const updateHabit = async (id, data) => {
  const response = await apiClient.patch(`/habits/${id}`, data);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await apiClient.delete(`/habits/${id}`);
  return response.data;
};

// Logs API
export const getTodayLogs = async () => {
  const response = await apiClient.get('/logs/today');
  return response.data;
};

export const upsertLog = async (logData) => {
  const response = await apiClient.post('/logs', logData);
  return response.data;
};

export const getHabitLogs = async (habitId) => {
  const response = await apiClient.get(`/logs/habit/${habitId}`);
  return response.data;
};

export const getHabitAnalytics = async (habitId) => {
  const response = await apiClient.get(`/logs/habit/${habitId}/analytics`);
  return response.data;
};

export default apiClient;
