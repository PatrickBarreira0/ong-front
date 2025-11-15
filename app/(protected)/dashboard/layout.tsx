"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, userType } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (!userType) {
      router.push("/");
      return;
    }

    // Verificar se o usuário tem acesso à página que está tentando acessar
    const allowedPaths = getPathsForRole(userType);
    const isAllowedPath = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAllowedPath) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isLoading, userType, pathname, router]);

  function getPathsForRole(role: string) {
    switch (role) {
      case "donor":
        return ["/dashboard/donor"];
      case "ong":
        return ["/dashboard/ong"];
      case "admin":
        return ["/dashboard/admin"];
      default:
        return [];
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 bg-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

