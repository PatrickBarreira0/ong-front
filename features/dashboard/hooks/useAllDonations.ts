import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

interface ItemDoado {
  id: number;
  quantidade: number;
  tipo_alimento?: {
    id: number;
    Nome: string;
    UnidadeMedida: string;
  };
}

interface Donor {
  id: number;
  username: string;
  email: string;
}

interface OngRecipient {
  id: number;
  username: string;
  email: string;
}

interface Donation {
  id: number;
  documentId: string;
  status_donation: 'Pendente' | 'Enviada' | 'Entregue';
  createdAt: string;
  updatedAt: string;
  item_doado: ItemDoado[];
  ong_recipient?: OngRecipient;
  donor?: Donor;
}

export function useAllDonations() {
  return useQuery({
    queryKey: ['all-donations'],
    queryFn: async () => {
      const response = await apiClient.get<Donation[]>('/api/donation/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

