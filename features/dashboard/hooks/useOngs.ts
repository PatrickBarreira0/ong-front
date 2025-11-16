import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export interface OngItem {
  id: number;
  documentId: string;
  username: string;
  email: string;
  documento?: string;
}

export function useAllOngs() {
  return useQuery({
    queryKey: ['ongs', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<OngItem[]>('/api/user/ong/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}


