"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAllOngs } from "@/features/dashboard/hooks/useOngs";
import { DataTable } from "@/components/ui/data-table";
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

export default function DonorDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: meData, isLoading, isError } = useMe();
  const { data: ongsData } = useAllOngs();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const userName = meData?.username || "Usuário";

  const { totalDonations, deliveredDonations } = useMemo(() => {
    if (!meData?.donations) return { totalDonations: 0, deliveredDonations: 0 };

    return {
      totalDonations: meData.donations.length,
      deliveredDonations: meData.donations.filter(donation => donation.status_donation === "Entregue").length,
    };
  }, [meData?.donations]);

  const mappedDonations = useMemo(() => {
    if (!meData?.donations) return [];

    const mapped = meData.donations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(donation => ({
        id: String(donation.id),
        items: donation.item_doado.map(item => ({
          name: item.tipo_alimento.Nome,
          quantity: `${item.quantidade} ${item.tipo_alimento.UnidadeMedida}`,
        })),
        ong: {
          id: String(donation.ong_recipient.id),
          name: donation.ong_recipient.username,
        },
        status_donation: donation.status_donation,
        createdAt: donation.createdAt,
        updatedAt: donation.updatedAt,
      }))
      .slice(0, 10);

    return mapped;
  }, [meData?.donations]);

  // Define columns for DataTable
  const columns = useMemo<ColumnDef<any>[]>(
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
          const ong = getValue<{ id: string; name: string }>();
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
      <Sidebar activePage="dashboard" />

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo(a) de volta, {userName}!</h2>
            <p className="text-gray-600 mt-1">Aqui está um resumo das suas contribuições. Obrigado por fazer a diferença!</p>
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
          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total de Doações */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3">
                    Total de Doações
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{totalDonations}</p>
                  <p className="text-gray-500 text-sm">Obrigado!</p>
                </div>
              </CardContent>
            </Card>

            {/* Doações Entregues */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div>
                  <h3 className="text-gray-600 font-medium mb-3">
                    Doações Entregues
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{deliveredDonations}</p>
                  <p className="text-gray-500 text-sm">Obrigado!</p>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <h3 className="text-gray-900 font-bold text-lg mb-4">Pronto para ajudar?</h3>
                  <Button
                    onClick={() => router.push("/dashboard/donor/donate")}
                    className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium px-6 py-2 rounded-lg"
                  >
                    ➕ Fazer Nova Doação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Doações Recentes */}
            <Card className="col-span-2 bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Suas Doações Recentes</h3>
                <p className="text-gray-600 text-sm mb-6">Acompanhe o status das suas últimas doações.</p>
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

            {/* ONGs Parceiras */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">ONGs Parceiras</h3>
                <p className="text-gray-600 text-sm mb-6">Conheça quem você está ajudando.</p>

                {!ongsData || ongsData.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma ONG encontrada.</p>
                ) : (
                  <div className="space-y-4">
                    {ongsData.map((ong, index) => (
                      <div
                        key={ong.id}
                        className={`flex items-start gap-3 ${index !== ongsData.length - 1 ? "pb-4 border-b border-gray-200" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            index % 2 === 0 ? "bg-blue-100" : "bg-purple-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${index % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{ong.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

