//hook exemplo de como usar o authStore
import { useAuthStore } from '@/features/auth/stores/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const hasRole = useAuthStore((state) => state.hasRole);

  return {
    // Estados
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout,
    updateUser,
    hasRole,
    
    // Helpers
    isAdmin: user?.userType === 'admin',
    isDonor: user?.userType === 'donor',
    isONG: user?.userType === 'ong',
    userType: user?.userType,
  };
}

/**
 * Hook para obter apenas o access token
 * Útil para usar em requisições API
 */
export function useAccessToken() {
  return useAuthStore((state) => state.accessToken);
}

/**
 * Hook para obter o usuário logado
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}

