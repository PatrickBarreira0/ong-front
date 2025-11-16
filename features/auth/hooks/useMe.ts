import { useQuery } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/authService';

interface ItemDoado {
  id: number;
  quantidade: number;
  tipo_alimento: {
    id: number;
    Nome: string;
    UnidadeMedida: string;
  };
}

interface OngRecipient {
  id: number;
  username: string;
  email: string;
  documento: string;
}

interface Donation {
  id: number;
  documentId: string;
  status_donation: 'Pendente' | 'Enviada' | 'Entregue';
  createdAt: string;
  updatedAt: string;
  item_doado: ItemDoado[];
  ong_recipient: OngRecipient;
}

interface MeResponse {
  id: number;
  username: string;
  email: string;
  documento: string;
  role: {
    id: number;
    name: string;
    type: 'donor' | 'ong' | 'admin';
  };
  donations: Donation[];
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data as MeResponse;
    },
    staleTime: 1000 * 60 * 5,
  });
}

