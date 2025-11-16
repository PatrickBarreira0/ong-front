import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

interface DonationItemInput {
  tipo_alimento: string;
  quantidade: number;
}

interface SubmitDonationParams {
  items: DonationItemInput[];
  ong_recipient: string;
  donorDocumentId: string;
}

export function useDonationSubmit() {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useMutation({
    mutationFn: async (params: SubmitDonationParams) => {
      const response = await apiClient.post('/api/donations', {
        data: {
          donor: params.donorDocumentId,
          item_doado: params.items,
          ong_recipient: params.ong_recipient,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Doação enviada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao enviar doação');
    },
  });
}

