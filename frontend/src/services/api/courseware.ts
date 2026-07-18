import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const coursewareApi = {
  list: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/courseware', { params }),

  upload: (formData: FormData) =>
    apiClient.post<ApiResponse<any>>('/courseware', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    apiClient.delete(`/courseware/${id}`),
};
