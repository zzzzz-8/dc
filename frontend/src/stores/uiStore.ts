import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  isDarkMode: boolean;
  isLoading: boolean;
  toasts: Toast[];

  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isDarkMode: localStorage.getItem('dark-mode') === 'true',
  isLoading: false,
  toasts: [],

  toggleDarkMode: () => {
    const newVal = !get().isDarkMode;
    localStorage.setItem('dark-mode', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDarkMode: newVal });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  showToast: (message, type = 'info', duration = 2000) => {
    const id = Date.now().toString();
    set(state => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },
}));
