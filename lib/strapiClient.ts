import { strapi as createStrapi } from '@strapi/client';
import { Env } from '@/lib/env';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Extract base URL from API_BASE_URL (which includes /api)
// NEXT_PUBLIC_API_BASE_URL = http://localhost:1337/api
// We need: http://localhost:1337
const getBaseUrl = (): string => {
  const apiUrl = Env.NEXT_PUBLIC_API_BASE_URL;
  // Remove trailing /api if present
  return apiUrl.replace(/\/?api\/?$/, '');
};

// Create Strapi client instance
// Note: Auth token will be added per-request via headers in donationService.ts
export const strapi = createStrapi({
  baseURL: getBaseUrl(),
});

// Helper to get token from auth store
export const getStrapiToken = (): string | undefined => {
  return useAuthStore.getState().accessToken;
};

