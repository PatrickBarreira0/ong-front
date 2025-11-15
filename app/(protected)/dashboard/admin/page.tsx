"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DataTable } from "@/components/ui/data-table";
import { useDonations } from "@/features/dashboard/hooks/useDonations";
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

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: donationsData, isLoading, isError } = useDonations({
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
        accessorKey: "ong",
        header: "ONG Destino",
        cell: ({ getValue }) => {
          const ong = getValue<DonationItem["ong"]>();
          return ong?.name || "-";
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
      <Sidebar activePage="admin" />

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Controle de Doações</h2>
            <p className="text-gray-600 mt-1">Gerenciar e monitorar todas as doações do sistema.</p>
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
          {/* Resumo rápido */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                    Total de Doações
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {donationsData?.meta?.pagination?.total || 0}
                  </p>
                  <p className="text-gray-500 text-sm">Registros no sistema</p>
                </div>
              </CardContent>
            </Card>

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

            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                    Requer Atenção
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Todas as Doações</h3>
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

