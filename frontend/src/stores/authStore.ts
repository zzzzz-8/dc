import { create } from 'zustand';
import type { User } from '../types/models';
import { authApi } from '../services/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth-token'),
  isAuthenticated: !!localStorage.getItem('auth-token'),
  isLoading: false,

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    const { user, token } = res.data.data!;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { user, token } = res.data.data!;
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      // Try loading from cache first
      const cached = localStorage.getItem('auth-user');
      if (cached) {
        set({ user: JSON.parse(cached) });
      }

      const res = await authApi.getProfile();
      set({ user: res.data.data!.user, isAuthenticated: true });
    } catch {
      // Token invalid - clear
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const res = await authApi.updateProfile(data);
    const updatedUser = res.data.data!.user;
    set({ user: { ...get().user!, ...updatedUser } });
    localStorage.setItem('auth-user', JSON.stringify({ ...get().user!, ...updatedUser }));
  },
}));
