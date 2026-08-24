import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('agentflow_token') : null,
  isAuthenticated: false,
  loading: true,
  error: null,

  initialize: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('agentflow_token') : null;
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, loading: false });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, token, isAuthenticated: true, loading: false, error: null });
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agentflow_token');
      }
      set({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('agentflow_token', token);
      }
      set({ user, token, isAuthenticated: true, loading: false, error: null });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      set({ error: errorMsg, loading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { user, token } = res.data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('agentflow_token', token);
      }
      set({ user, token, isAuthenticated: true, loading: false, error: null });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      set({ error: errorMsg, loading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agentflow_token');
    }
    set({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
  },
}));
