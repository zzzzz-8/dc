import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const dictionaryApi = {
  search: (params: { q: string; source?: string }) =>
    apiClient.get<ApiResponse<any>>('/dictionary/search', { params }),

  getSources: () =>
    apiClient.get<ApiResponse<any>>('/dictionary/sources'),
};
