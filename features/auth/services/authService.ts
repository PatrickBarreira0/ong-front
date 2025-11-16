//mapeia as rotas da api
import type { AxiosRequestConfig } from 'axios';
import apiClient from '@/lib/api';

export const authService = {
  signIn(credentials) {
    return apiClient.post('/api/auth/local', credentials);
  },
  signUp(userData) {
    return apiClient.post<void>('/api/auth/local/register', userData);
  },
  getMe(config?: AxiosRequestConfig) {
    return apiClient.get('/api/users/me', config);
  },
  refreshToken: (config?: AxiosRequestConfig) => {
    return apiClient.post('/api/auth/refresh', undefined, config);
  },
  logout: () => {
    return apiClient.post('/api/auth/logout');
  },
  setUserRole(role: string, config?: AxiosRequestConfig) {
    return apiClient.put(`/api/user/role/${role}`, {}, config);
  },
};