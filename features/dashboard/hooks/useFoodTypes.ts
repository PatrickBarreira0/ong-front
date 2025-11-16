import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export interface FoodTypeItem {
  id: number;
  documentId: string;
  Nome: string;
  UnidadeMedida: string;
}

export function useFoodTypes() {
  return useQuery({
    queryKey: ['food-types', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<FoodTypeItem[]>('/api/TipoAlimento/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}


