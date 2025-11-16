import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/stores/authStore';

interface SetUserRoleParams {
  role: string;
  jwt: string;
}

export function useSetUserRole() {
  const updateUser = useAuthStore((state) => state.updateUser);

  const { mutate: setUserRole, isPending } = useMutation({
    mutationFn: async ({ role, jwt }: SetUserRoleParams) => {
      const response = await authService.setUserRole(role, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data as any);
    },
    onError: (error: any) => {
      console.error('Erro ao definir role do usuário:', error);
      throw error;
    },
  });

  return { setUserRole, isPending };
}

