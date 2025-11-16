"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DataTable } from "@/components/ui/data-table";
import { useAllDonations } from "@/features/dashboard/hooks/useAllDonations";
import { useUpdateDonationStatus } from "@/features/dashboard/hooks/useUpdateDonationStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaginationState, SortingState, ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreVertical } from "lucide-react";

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

interface DonationRow {
  id: string;
  documentId: string;
  items: Array<{ name: string; quantity: string }>;
  ong: { id: string; name?: string };
  donor?: string;
  status_donation: 'Pendente' | 'Enviada' | 'Entregue';
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: donationsData, isLoading, isError } = useAllDonations();
  const { mutate: updateStatus, isPending } = useUpdateDonationStatus();

  const mappedDonations = useMemo(() => {
    if (!donationsData) return [];

    return donationsData.map(donation => ({
      id: String(donation.id),
      documentId: donation.documentId,
      items: donation.item_doado.map(item => ({
        name: item.tipo_alimento?.Nome || "N/A",
        quantity: `${item.quantidade} ${item.tipo_alimento?.UnidadeMedida || ""}`,
      })),
      ong: {
        id: String(donation.ong_recipient?.id),
        name: donation.ong_recipient?.username,
      },
      donor: donation.donor?.username,
      status_donation: donation.status_donation,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
    }));
  }, [donationsData]);

  const columns = useMemo<ColumnDef<DonationRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => `#${String(getValue()).padStart(4, "0")}`,
      },
      {
        accessorKey: "items",
        header: "Itens",
        cell: ({ getValue }) => {
          const items = getValue<Array<{ name: string; quantity: string }>>();
          return (
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="text-sm border-b border-gray-200 pb-2 last:border-b-0">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-gray-600 text-xs">{item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "ong",
        header: "ONG Destino",
        cell: ({ getValue }) => {
          const ong = getValue<{ id: string; name?: string }>();
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
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const donation = row.original;
          const statuses: Array<'Pendente' | 'Enviada' | 'Entregue'> = ['Pendente', 'Enviada', 'Entregue'];

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() =>
                      updateStatus({
                        donationId: donation.documentId,
                        status,
                      })
                    }
                    disabled={donation.status_donation === status}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isPending]
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
                    {donationsData?.length || 0}
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
                    {donationsData?.filter(d => d.status_donation === "Entregue").length || 0}
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
                    {donationsData?.filter(d => d.status_donation !== "Entregue").length || 0}
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
                data={mappedDonations}
                pageCount={1}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                isLoading={isLoading}
                isError={isError}
                manualPagination
                manualSorting
                hidePagination
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

