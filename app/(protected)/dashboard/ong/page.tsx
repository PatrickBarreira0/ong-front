"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DataTable } from "@/components/ui/data-table";
import { useDonationsByOng } from "@/features/dashboard/hooks/useDonations";
import type { PaginationState, SortingState, ColumnDef } from "@tanstack/react-table";
import type { DonationItem } from "@/features/dashboard/services/donationService";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Entregue":
      return "bg-green-100 text-green-700";
    case "Enviada":
      return "bg-yellow-100 text-yellow-700";
    case "Pendente":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Gerar cor de avatar baseado no nome
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function ONGDashboard() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [ongName] = useState("Comunidade Solidária");

  // Get ONG ID from user context (you'll need to add this to auth)
  const ongId = "1"; // Temporary - will come from user context

  const { data: donationsData, isLoading, isError } = useDonationsByOng({
    ongId,
    pagination,
    sorting,
  });

  // Define columns for DataTable
  const columns = useMemo<ColumnDef<DonationItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => `#${String(getValue()).padStart(4, "0")}`,
      },
      {
        accessorKey: "Alimentos",
        header: "Alimento",
      },
      {
        accessorKey: "quantity",
        header: "Quantidade",
      },
      {
        accessorKey: "user",
        header: "Doador",
        cell: ({ getValue }) => {
          const user = getValue<DonationItem["user"]>();
          return user?.username || "-";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
        },
      },
      {
        accessorKey: "status_donation",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      {/* Sidebar */}
      <Sidebar activePage="ong" />

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard - {ongName}</h2>
            <p className="text-gray-600 mt-1">Acompanhe as doações recebidas e seus principais doadores.</p>
          </div>
          
          <Button
            onClick={handleLogout}
            className="bg-gray-900 hover:bg-black text-white font-medium px-4 py-2 rounded-lg"
          >
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Top Row - Stats e Leaderboard */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total de Doações */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                    Total de Doações Recebidas
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {donationsData?.meta?.pagination?.total || 0}
                  </p>
                  <p className="text-gray-500 text-sm">Obrigado aos doadores!</p>
                </div>
              </CardContent>
            </Card>

            {/* Doações Entregues */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                    Doações Entregues
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {donationsData?.data?.filter(d => d.status_donation === "Entregue").length || 0}
                  </p>
                  <p className="text-gray-500 text-sm">Concluídas com sucesso</p>
                </div>
              </CardContent>
            </Card>

            {/* Pendentes */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                    Aguardando Entrega
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {donationsData?.data?.filter(d => d.status_donation !== "Entregue").length || 0}
                  </p>
                  <p className="text-gray-500 text-sm">Pendentes ou em processamento</p>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Tabela de Doações */}
          <Card className="bg-white border border-gray-200 shadow-md">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico de Doações</h3>
              <DataTable
                columns={columns}
                data={donationsData?.data || []}
                pageCount={donationsData?.meta?.pagination?.pageCount || 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                isLoading={isLoading}
                isError={isError}
                manualPagination
                manualSorting
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

