import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authService } from '@/features/auth/services/authService';
import { useRouter } from 'next/navigation';

interface SignInCredentials {
  identifier: string;
  password: string;
}

export function useSignIn() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const { mutate: signIn, isPending, error } = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      // Limpar sessão anterior
      useAuthStore.getState().logout();
      localStorage.removeItem('auth-storage');

      // Fazer login
      const loginResponse = await authService.signIn(credentials);
      const { jwt: accessToken, user: userData } = loginResponse.data;

      if (!userData || !accessToken) {
        throw new Error("Resposta da API em formato inesperado");
      }

      // Salvar token temporariamente pra chamar getMe()
      useAuthStore.getState().updateToken(accessToken);

      // Buscar dados completos do usuário (com role)
      const userResponse = await authService.getMe();
      const completeUser = userResponse.data.user || userResponse.data;

      // Mapear role.type para userType
      if (completeUser && completeUser.role?.type) {
        completeUser.userType = completeUser.role.type;
      }

      return { user: completeUser, accessToken };
    },
    onSuccess: ({ user, accessToken }) => {
      login(user, accessToken);
      
      // Redirecionar baseado na role do usuário
      const userType = user?.userType;
      if (userType === 'admin') {
        router.push('/dashboard/admin');
      } else if (userType === 'ong') {
        router.push('/dashboard/ong');
      } else if (userType === 'donor') {
        router.push('/dashboard/donor');
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      useAuthStore.getState().logout();
    },
  });

  return { signIn, isPending, error };
}

