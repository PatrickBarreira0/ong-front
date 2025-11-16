import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDonation } from '@/features/dashboard/services/donationService';
import { toast } from 'sonner';

type DonationStatus = 'Pendente' | 'Enviada' | 'Entregue';

export function useUpdateDonationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ donationId, status }: { donationId: string | number; status: DonationStatus }) => {
      return updateDonation(donationId, { status_donation: status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-donations'] });
      toast.success('Status da doação atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status da doação');
    },
  });
}

