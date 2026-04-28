const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('uprise_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('uprise_token');
      window.location.href = '/';
    }
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(err.message);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (data: any) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  // Profile
  getProfile: () => request('/api/profile'),
  updateProfile: (data: any) =>
    request('/api/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Tasks
  getTasks: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/tasks${qs}`);
  },
  getTask: (id: string) => request(`/api/tasks/${id}`),
  createTask: (data: any) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  applyTask: (id: string, data?: any) =>
    request(`/api/tasks/${id}/apply`, { method: 'POST', body: JSON.stringify(data || {}) }),
  getMyTasks: () => request('/api/tasks/my'),
};

export default api;
