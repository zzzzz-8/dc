import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const membershipApi = {
  getMembership: () =>
    apiClient.get<ApiResponse<any>>('/membership'),

  purchase: (data: { plan: string }) =>
    apiClient.post<ApiResponse<any>>('/membership/purchase', data),

  getCredits: () =>
    apiClient.get<ApiResponse<any>>('/membership/credits'),

  purchaseCredits: (data: { amount: number }) =>
    apiClient.post<ApiResponse<any>>('/membership/credits/purchase', data),
};
