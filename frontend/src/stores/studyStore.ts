import { create } from 'zustand';
import { studyApi } from '../services/api/study';
import type { StudyTodayResponse, StudyRecordResponse } from '../types/api';
import type { Word } from '../types/models';

interface StudyState {
  todayData: StudyTodayResponse | null;
  currentWord: Word | null;
  currentIndex: number;
  correctCount: number;
  errorCount: number;
  isFlipped: boolean;
  isAnimating: boolean;
  isLoading: boolean;

  loadToday: () => Promise<void>;
  setCurrentWord: (word: Word | null) => void;
  recordResult: (wordId: string, isCorrect: boolean, mode: 'new' | 'review') => Promise<StudyRecordResponse>;
  flipCard: () => void;
  nextWord: () => void;
  reset: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  todayData: null,
  currentWord: null,
  currentIndex: 0,
  correctCount: 0,
  errorCount: 0,
  isFlipped: false,
  isAnimating: false,
  isLoading: false,

  loadToday: async () => {
    set({ isLoading: true });
    try {
      const res = await studyApi.getToday();
      set({ todayData: res.data.data! });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentWord: (word) => set({
    currentWord: word,
    isFlipped: false,
    isAnimating: false,
  }),

  recordResult: async (wordId, isCorrect, mode) => {
    const res = await studyApi.record({ wordId, isCorrect, mode });
    const data = res.data.data!;

    if (isCorrect) {
      set(state => ({ correctCount: state.correctCount + 1 }));
    } else {
      set(state => ({ errorCount: state.errorCount + 1 }));
    }

    return data;
  },

  flipCard: () => set(state => ({
    isFlipped: !state.isFlipped,
    isAnimating: true,
  })),

  nextWord: () => {
    set({ isAnimating: false, isFlipped: false });
  },

  reset: () => set({
    currentWord: null,
    currentIndex: 0,
    correctCount: 0,
    errorCount: 0,
    isFlipped: false,
    isAnimating: false,
  }),
}));
