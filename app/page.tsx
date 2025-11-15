'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userType } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && userType) {
      switch (userType) {
        case 'donor':
          router.replace('/dashboard/donor');
          break;
        case 'ong':
          router.replace('/dashboard/ong');
          break;
        case 'admin':
          router.replace('/dashboard/admin');
          break;
      }
    } else {
      router.replace('/signin');
    }
  }, [isAuthenticated, isLoading, userType, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Carregando...</p>
      </div>
    </div>
  );
}