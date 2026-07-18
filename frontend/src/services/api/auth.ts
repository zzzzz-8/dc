import apiClient from './client';
import type { ApiResponse, AuthResponse } from '../../types/api';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getProfile: () =>
    apiClient.get<ApiResponse<{ user: any }>>('/auth/profile'),

  updateProfile: (data: any) =>
    apiClient.put<ApiResponse<{ user: any }>>('/auth/profile', data),
};
