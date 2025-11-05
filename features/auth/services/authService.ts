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
    return apiClient.get('/auth/usuario/me', config);
  },
  refreshToken: (config?: AxiosRequestConfig) => {
    return apiClient.post('/auth/refresh', undefined, config);
  },
  logout: () => {
    return apiClient.post('/auth/logout');
  },
};