// salva dados do usuario em estado para ser chamado em qualquer lugar da aplicação

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export type UserType = "donor" | "ong" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  address?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateToken: (accessToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Utility
  getUserType: () => UserType | null;
  hasRole: (role: UserType) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({

      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, accessToken) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      updateToken: (accessToken) => {
        set({
          accessToken,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Get user type
      getUserType: () => {
        return get().user?.userType || null;
      },

      // Check if user has specific role
      hasRole: (role) => {
        return get().user?.userType === role;
      },
    }),
    {
      name: 'auth-storage', // nome da key no localStorage
      storage: createJSONStorage(() => localStorage), // usa localStorage
      // Você pode especificar quais campos persistir
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuthHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
};

