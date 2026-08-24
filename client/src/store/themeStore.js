import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: typeof window !== 'undefined' ? localStorage.getItem('agentflow_theme') || 'dark' : 'dark',

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agentflow_theme') || 'dark';
      if (stored === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      set({ theme: stored });
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentflow_theme', next);
      if (next === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }
    set({ theme: next });
  },
}));
