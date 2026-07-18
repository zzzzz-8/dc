import apiClient from './client';
import type { ApiResponse } from '../../types/api';
import type { Wordbook, Word } from '../../types/models';

export const wordbookApi = {
  list: (params?: any) =>
    apiClient.get<ApiResponse<{ items: Wordbook[]; total: number; page: number; totalPages: number }>>('/wordbooks', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<{ wordbook: Wordbook; words: Word[]; progress: { learned: number; total: number; mastered: number } }>>(`/wordbooks/${id}`),

  getWords: (id: string, params?: any) =>
    apiClient.get<ApiResponse<{ items: Word[]; total: number }>>(`/wordbooks/${id}/words`, { params }),

  getMine: () =>
    apiClient.get<ApiResponse<{ items: any[] }>>('/wordbooks/mine'),

  createCustom: (data: { name: string; label: string; words: { word: string; meaning: string; phonetic?: string }[] }) =>
    apiClient.post<ApiResponse<any>>('/wordbooks/custom', data),

  subscribe: (id: string) =>
    apiClient.post(`/wordbooks/${id}/subscribe`),

  unsubscribe: (id: string) =>
    apiClient.delete(`/wordbooks/${id}/subscribe`),
};
