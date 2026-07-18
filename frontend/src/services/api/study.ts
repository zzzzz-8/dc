import apiClient from './client';
import type { ApiResponse, StudyTodayResponse, StudyRecordResponse } from '../../types/api';

export const studyApi = {
  getToday: () =>
    apiClient.get<ApiResponse<StudyTodayResponse>>('/study/today'),

  record: (data: { wordId: string; isCorrect: boolean; mode: 'new' | 'review' }) =>
    apiClient.post<ApiResponse<StudyRecordResponse>>('/study/record', data),

  getProgress: () =>
    apiClient.get<ApiResponse<any>>('/study/progress'),

  getRecords: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/study/records', { params }),

  getUserWords: (params?: any) =>
    apiClient.get<ApiResponse<{ items: any[]; total: number; page: number }>>('/study/user-words', { params }),
};
