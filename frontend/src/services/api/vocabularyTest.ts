import apiClient from './client';
import type { ApiResponse, VocabularyTestStartResponse, VocabularyTestResult } from '../../types/api';

export const vocabularyTestApi = {
  start: () =>
    apiClient.post<ApiResponse<VocabularyTestStartResponse>>('/vocabulary-test/start'),

  submit: (data: { testId: string; answers: number[]; timeUsed: number }) =>
    apiClient.post<ApiResponse<VocabularyTestResult>>('/vocabulary-test/submit', data),

  getHistory: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/vocabulary-test/history', { params }),

  getReport: (id: string) =>
    apiClient.get<ApiResponse<any>>(`/vocabulary-test/report/${id}`),
};
