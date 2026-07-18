import { create } from 'zustand';
import { wordbookApi } from '../services/api/wordbook';
import type { Wordbook } from '../types/models';

interface WordbookState {
  wordbooks: Wordbook[];
  myWordbooks: any[];
  currentWordbook: any | null;
  isLoading: boolean;

  loadWordbooks: (params?: any) => Promise<void>;
  loadMyWordbooks: () => Promise<void>;
  setCurrentWordbook: (wb: any | null) => void;
  subscribe: (id: string) => Promise<void>;
  unsubscribe: (id: string) => Promise<void>;
}

export const useWordbookStore = create<WordbookState>((set, get) => ({
  wordbooks: [],
  myWordbooks: [],
  currentWordbook: null,
  isLoading: false,

  loadWordbooks: async (params) => {
    set({ isLoading: true });
    try {
      const res = await wordbookApi.list(params);
      set({ wordbooks: res.data.data?.items || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMyWordbooks: async () => {
    set({ isLoading: true });
    try {
      const res = await wordbookApi.getMine();
      set({ myWordbooks: res.data.data?.items || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentWordbook: (wb) => set({ currentWordbook: wb }),

  subscribe: async (id) => {
    await wordbookApi.subscribe(id);
    get().loadMyWordbooks();
  },

  unsubscribe: async (id) => {
    await wordbookApi.unsubscribe(id);
    get().loadMyWordbooks();
  },
}));
