//coisas pra facilitar o post da api
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function useSignUp() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const login = useAuthStore((state) => state.login);
  
  
  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const response = await authService.signUp(data);
      return response.data;
    },
    onSuccess: (data) => {
        updateUser(data as any);
    },
    onError: (error: any) => {
      console.error('Erro ao fazer sign up:', error);
      throw error;
    },
  });

  return { signUp, isPending };
}
