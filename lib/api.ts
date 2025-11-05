// todo local que eu usar a api, eu pego o mesmo token jwt
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Env } from '@/lib/env';

const API_BASE_URL = Env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api';

const apiClient: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default apiClient;

