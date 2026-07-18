import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const errorBookApi = {
  list: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/error-book', { params }),

  remove: (wordId: string) =>
    apiClient.delete(`/error-book/${wordId}`),

  addNote: (wordId: string, data: { note: string }) =>
    apiClient.post<ApiResponse<any>>(`/error-book/note/${wordId}`, data),

  exportToWordbook: (data?: { name?: string; wordIds?: string[] }) =>
    apiClient.post<ApiResponse<any>>('/error-book/export', data || {}),

  toggleCollect: (wordId: string) =>
    apiClient.post(`/error-book/collect/${wordId}`),
};
