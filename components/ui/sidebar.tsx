"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
  activePage?: "dashboard" | "donate" | "admin" | "history";
}

export function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const router = useRouter();

  const isActive = (page: string) => activePage === page;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 p-6">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-900">Sistema generico</h1>
      </div>

      <nav className="space-y-4">
        <button 
          onClick={() => router.push("/dashboard")}
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

        <button 
          onClick={() => router.push("/dashboard/donate")}
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

        <button 
          onClick={() => router.push("/dashboard/donations")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            isActive("admin")
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          </svg>
          Controle Admin
        </button>

        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            isActive("history")
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Relatórios
        </button>
      </nav>
    </aside>
  );
}
