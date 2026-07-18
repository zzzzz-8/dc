import apiClient from './client';
import type { ApiResponse, CycleStageData } from '../../types/api';

export const reviewApi = {
  getPlan: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/review/plan', { params }),

  getCycleStages: (params?: any) =>
    apiClient.get<ApiResponse<CycleStageData>>('/review/cycle', { params }),

  getCycleWords: (params?: any) =>
    apiClient.get<ApiResponse<{ items: any[]; total: number }>>('/review/cycle-words', { params }),

  processCycleReview: (wordId: string, data: { isCorrect: boolean }) =>
    apiClient.post<ApiResponse<any>>(`/review/cycle/${wordId}`, data),
};
