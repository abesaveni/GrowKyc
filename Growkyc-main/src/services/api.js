/**
 * Centralized API Service Layer
 *
 * Provides an axios instance pre-configured with the FastAPI
 * backend base URL.  All placeholder endpoints mirror the
 * signatures previously fulfilled by Supabase / AWS so that
 * existing UI code can call them without changes.
 */

import axios from 'axios';
import { BASE_URL } from '../config/api';

export const normalizeApiError = (error) => {
  if (!error.response) {
    return {
      status: 0,
      code: 'NETWORK_ERROR',
      message: error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to reach the API. Please check your connection and try again.',
      details: null,
    };
  }

  const data = error.response.data || {};
  return {
    status: error.response.status,
    code: data.code || data.errorCode || `HTTP_${error.response.status}`,
    message: data.message || data.error || error.message || 'API request failed.',
    details: data.details || data,
  };
};

const getStoredJwt = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('growkyc_token');
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getStoredJwt();

  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = normalizeApiError(error);
    error.apiError = apiError;

    if (apiError.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('growkyc_token');
      window.dispatchEvent(new CustomEvent('growkyc:unauthorized', { detail: apiError }));
    }

    return Promise.reject(error);
  },
);

// ── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  signIn: (email, password) =>
    api.post('/auth/login', { email, password }),

  signUp: (email, password, metadata) =>
    api.post('/auth/register', { email, password, ...metadata }),

  signInWithOAuth: (provider) =>
    api.post('/auth/oauth', { provider }),

  signOut: () => api.post('/auth/logout'),

  getSession: () => api.get('/auth/session'),

  refreshSession: () => api.post('/auth/refresh'),

  resetPassword: (email) =>
    api.post('/auth/reset-password', { email }),

  updatePassword: (newPassword) =>
    api.post('/auth/update-password', { password: newPassword }),

  verifyEmail: (token) =>
    api.post('/auth/verify-email', { token }),

  setupMFA: () => api.post('/auth/mfa/setup'),

  verifyMFA: (factorId, code) =>
    api.post('/auth/mfa/verify', { factorId, code }),
};

// ── Audit ───────────────────────────────────────────────────────
export const auditAPI = {
  log: (payload) => api.post('/audit/log', payload),
};

// ── File Storage ────────────────────────────────────────────────
export const storageAPI = {
  listFiles: (module, folder) =>
    api.get(`/files/list`, { params: { module, folder } }),

  uploadFile: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  downloadFile: (path) => api.get(`/files/download/${path}`),

  deleteFile: (path) => api.delete(`/files/delete/${path}`),

  searchFiles: (query, module) =>
    api.get('/files/search', { params: { q: query, module } }),
};

export default api;
