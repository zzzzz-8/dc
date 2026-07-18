import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export const userApi = {
  getStudents: () =>
    apiClient.get<ApiResponse<any>>('/user/students'),

  createStudent: (data: any) =>
    apiClient.post<ApiResponse<any>>('/user/students', data),

  updateStudent: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/user/students/${id}`, data),

  deleteStudent: (id: string) =>
    apiClient.delete(`/user/students/${id}`),

  getScheduleStats: (params?: any) =>
    apiClient.get<ApiResponse<any>>('/user/schedule-stats', { params }),
};
