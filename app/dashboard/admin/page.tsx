"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Tipos de dados
interface DonationItem {
  food: string;
  quantity: number;
  unit: string;
}

interface Donation {
  id: number;
  items: DonationItem[];
  user: string;
  ong: string;
  status: "Entregue" | "Em processamento" | "Pendente";
  date: string;
}

// Mock data de doações com múltiplos itens (dados estáticos)
const allDonations: Donation[] = [
  { id: 1, items: [{ food: "Arroz", quantity: 25, unit: "kg" }], user: "João Silva", ong: "Comunidade Solidária", status: "Entregue", date: "01/11/2025" },
  { id: 2, items: [{ food: "Feijão", quantity: 15, unit: "kg" }, { food: "Óleo", quantity: 5, unit: "L" }], user: "Maria Santos", ong: "Anjos da Noite", status: "Em processamento", date: "30/10/2025" },
  { id: 3, items: [{ food: "Macarrão", quantity: 30, unit: "unidades" }], user: "Pedro Costa", ong: "Esperança Viva", status: "Pendente", date: "29/10/2025" },
  { id: 4, items: [{ food: "Leite", quantity: 10, unit: "L" }, { food: "Pão", quantity: 20, unit: "unidades" }, { food: "Açúcar", quantity: 5, unit: "kg" }], user: "Ana Oliveira", ong: "Comunidade Solidária", status: "Entregue", date: "28/10/2025" },
  { id: 5, items: [{ food: "Sal", quantity: 3, unit: "kg" }], user: "Carlos Souza", ong: "Anjos da Noite", status: "Entregue", date: "27/10/2025" },
  { id: 6, items: [{ food: "Arroz", quantity: 20, unit: "kg" }, { food: "Feijão", quantity: 10, unit: "kg" }], user: "João Silva", ong: "Esperança Viva", status: "Em processamento", date: "26/10/2025" },
  { id: 7, items: [{ food: "Macarrão", quantity: 25, unit: "unidades" }], user: "Maria Santos", ong: "Comunidade Solidária", status: "Entregue", date: "25/10/2025" },
  { id: 8, items: [{ food: "Leite", quantity: 8, unit: "L" }], user: "Pedro Costa", ong: "Anjos da Noite", status: "Pendente", date: "24/10/2025" },
  { id: 9, items: [{ food: "Óleo", quantity: 3, unit: "L" }, { food: "Sal", quantity: 2, unit: "kg" }], user: "Ana Oliveira", ong: "Esperança Viva", status: "Entregue", date: "23/10/2025" },
  { id: 10, items: [{ food: "Pão", quantity: 15, unit: "unidades" }], user: "Carlos Souza", ong: "Comunidade Solidária", status: "Em processamento", date: "22/10/2025" },
];

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { logout } = useAuth();

  // Calcular dados de paginação
  const totalPages = Math.ceil(allDonations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDonations = allDonations.slice(startIndex, endIndex);

  // Função para obter a cor do badge de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-700";
      case "Em processamento":
        return "bg-yellow-100 text-yellow-700";
      case "Pendente":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
                  <p className="text-4xl font-bold text-gray-900 mb-2">{allDonations.length}</p>
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
                    {allDonations.filter(d => d.status === "Entregue").length}
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
                    {allDonations.filter(d => d.status !== "Entregue").length}
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
              <p className="text-gray-600 text-sm mb-6">Página {currentPage} de {totalPages} • Total: {allDonations.length} doações</p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">ID</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Itens Doados</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Doador</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">ONG Destino</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Data</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDonations.length > 0 ? (
                      currentDonations.map((donation) => (
                        <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-3 text-gray-900 text-sm font-medium">#{donation.id.toString().padStart(4, "0")}</td>
                          <td className="py-4 px-3">
                            <div className="max-h-24 overflow-y-auto space-y-1 pr-2">
                              {donation.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-700 whitespace-nowrap">
                                  <span className="font-medium">{item.food}</span>
                                  <span className="text-gray-500"> • {item.quantity} {item.unit}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-3 text-gray-600 text-sm">{donation.user}</td>
                          <td className="py-4 px-3 text-gray-600 text-sm">{donation.ong}</td>
                          <td className="py-4 px-3 text-gray-600 text-sm">{donation.date}</td>
                          <td className="py-4 px-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          Nenhuma doação encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, allDonations.length)} de {allDonations.length} doações
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Anterior
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

