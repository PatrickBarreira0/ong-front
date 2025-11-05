"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface SidebarProps {
  activePage?: "dashboard" | "donate" | "admin" | "ong";
}

export function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const router = useRouter();
  const { userType } = useAuth();

  const isActive = (page: string) => activePage === page;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 p-6">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900">Sistema de Doações</h1>
      </div>

      <nav className="space-y-4">
        {/* Dashboard Donor - Apenas Donors veem */}
        {userType === "donor" && (
          <button 
            onClick={() => router.push("/dashboard/donor")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive("dashboard")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Dashboard
          </button>
        )}

        {/* Dashboard ONG - Apenas ONGs veem */}
        {userType === "ong" && (
          <button 
            onClick={() => router.push("/dashboard/ong")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive("ong")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Dashboard
          </button>
        )}

        {/* Dashboard Admin - Apenas Admin vê */}
        {userType === "admin" && (
          <button 
            onClick={() => router.push("/dashboard/admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive("admin")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Dashboard Admin
          </button>
        )}

        {/* Fazer Doação - Apenas Donors veem */}
        {userType === "donor" && (
          <button 
            onClick={() => router.push("/dashboard/donor/donate")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive("donate")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Fazer Doação
          </button>
        )}
      </nav>
    </aside>
  );
}
