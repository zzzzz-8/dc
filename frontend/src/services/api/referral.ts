import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const referralApi = {
  getStats: () =>
    apiClient.get<ApiResponse<any>>('/referral/stats'),

  getRecords: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/referral/records', { params }),
};
