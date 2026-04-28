import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 — auto-redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  signup: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/api/auth/signup', data),
  me: () => api.get('/api/auth/me'),
  updateProfile: (data: any) => api.put('/api/auth/profile', data),
};

// ─── Tasks ──────────────────────────────────────────────
export const tasksAPI = {
  list: (params?: { category?: string; status?: string; page?: number }) =>
    api.get('/api/tasks', { params }),
  get: (id: string) => api.get(`/api/tasks/${id}`),
  create: (data: any) => api.post('/api/tasks', data),
  accept: (id: string) => api.post(`/api/tasks/${id}/accept`),
  submit: (id: string, data: { submission_url: string; notes?: string }) =>
    api.post(`/api/tasks/${id}/submit`, data),
  complete: (id: string, data: { rating: number; review: string }) =>
    api.post(`/api/tasks/${id}/complete`, data),
  bid: (id: string, data: { amount: number; message?: string }) =>
    api.post(`/api/tasks/${id}/bid`, data),
  myTasks: (role: 'poster' | 'earner') =>
    api.get('/api/tasks/my', { params: { role } }),
};

// ─── Mentors ────────────────────────────────────────────
export const mentorsAPI = {
  list: (params?: { skill?: string; minPrice?: number; maxPrice?: number }) =>
    api.get('/api/mentors', { params }),
  get: (id: string) => api.get(`/api/mentors/${id}`),
  book: (id: string, data: { slot: string; topic?: string }) =>
    api.post(`/api/mentors/${id}/book`, data),
  sessions: () => api.get('/api/mentors/sessions'),
};

// ─── Portfolio ──────────────────────────────────────────
export const portfolioAPI = {
  get: (id: string) => api.get(`/api/portfolio/${id}`),
  create: (data: any) => api.post('/api/portfolio', data),
  update: (id: string, data: any) => api.put(`/api/portfolio/${id}`, data),
};

// ─── Wallet ─────────────────────────────────────────────
export const walletAPI = {
  balance: () => api.get('/api/wallet/balance'),
  transactions: (params?: { type?: string; page?: number }) =>
    api.get('/api/wallet/transactions', { params }),
};

// ─── AI ────────────────────────────────────────────────
export const aiAPI = {
  recommendTasks: (userId: string) =>
    api.get('/api/ai/recommend/tasks', { params: { userId } }),
  recommendMentors: (userId: string) =>
    api.get('/api/ai/recommend/mentors', { params: { userId } }),
  suggestPricing: (data: any) =>
    api.post('/api/ai/suggest-pricing', data),
};

export default api;
