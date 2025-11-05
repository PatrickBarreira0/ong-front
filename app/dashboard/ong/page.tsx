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
  donor: string;
  status: "Entregue" | "Em processamento" | "Pendente";
  date: string;
}

interface TopDonor {
  name: string;
  totalDonations: number;
  avatar: string;
}

interface TopFood {
  name: string;
  quantity: number;
  unit: string;
}

// Mock data - Doações para esta ONG específica
const ongDonations: Donation[] = [
  { id: 1, items: [{ food: "Arroz", quantity: 25, unit: "kg" }], donor: "João Silva", status: "Entregue", date: "01/11/2025" },
  { id: 4, items: [{ food: "Leite", quantity: 10, unit: "L" }, { food: "Pão", quantity: 20, unit: "unidades" }, { food: "Açúcar", quantity: 5, unit: "kg" }], donor: "Ana Oliveira", status: "Entregue", date: "28/10/2025" },
  { id: 7, items: [{ food: "Macarrão", quantity: 25, unit: "unidades" }], donor: "Maria Santos", status: "Entregue", date: "25/10/2025" },
  { id: 10, items: [{ food: "Pão", quantity: 15, unit: "unidades" }], donor: "Carlos Souza", status: "Em processamento", date: "22/10/2025" },
  { id: 13, items: [{ food: "Açúcar", quantity: 4, unit: "kg" }], donor: "Pedro Costa", status: "Entregue", date: "19/10/2025" },
  { id: 16, items: [{ food: "Arroz", quantity: 15, unit: "kg" }], donor: "João Silva", status: "Pendente", date: "16/10/2025" },
  { id: 19, items: [{ food: "Pão", quantity: 30, unit: "unidades" }, { food: "Óleo", quantity: 4, unit: "L" }, { food: "Açúcar", quantity: 6, unit: "kg" }], donor: "Ana Oliveira", status: "Entregue", date: "13/10/2025" },
  { id: 22, items: [{ food: "Macarrão", quantity: 20, unit: "unidades" }], donor: "Maria Santos", status: "Em processamento", date: "10/10/2025" },
];

// Top doadores calculados a partir das doações
const topDonors: TopDonor[] = [
  { name: "João Silva", totalDonations: 3, avatar: "JS" },
  { name: "Ana Oliveira", totalDonations: 3, avatar: "AO" },
  { name: "Carlos Souza", totalDonations: 2, avatar: "CS" },
  { name: "Maria Santos", totalDonations: 2, avatar: "MS" },
  { name: "Pedro Costa", totalDonations: 2, avatar: "PC" },
];

// Alimentos mais doados calculados
const topFoods: TopFood[] = [
  { name: "Arroz", quantity: 70, unit: "kg" },
  { name: "Pão", quantity: 65, unit: "unidades" },
  { name: "Macarrão", quantity: 45, unit: "unidades" },
  { name: "Açúcar", quantity: 22, unit: "kg" },
  { name: "Leite", quantity: 18, unit: "L" },
];

const ITEMS_PER_PAGE = 8;

export default function ONGDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [ongName] = useState("Comunidade Solidária"); // Será substituído com dados reais
  const router = useRouter();
  const { logout } = useAuth();

  // Calcular dados de paginação
  const totalPages = Math.ceil(ongDonations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDonations = ongDonations.slice(startIndex, endIndex);

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
                  <p className="text-4xl font-bold text-gray-900 mb-2">{ongDonations.length}</p>
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
                    {ongDonations.filter(d => d.status === "Entregue").length}
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
                    {ongDonations.filter(d => d.status !== "Entregue").length}
                  </p>
                  <p className="text-gray-500 text-sm">Pendentes ou em processamento</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Leaderboards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Top Doadores */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                   Maiores Doadores
                </h3>
                <p className="text-gray-600 text-sm mb-6">Nossos principais apoiadores</p>
                
                <div className="space-y-3">
                  {topDonors.map((donor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                      <div className={`w-10 h-10 ${getAvatarColor(donor.name)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">{donor.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                        <p className="text-gray-500 text-xs">{donor.totalDonations} doações</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && <span className="text-gray-400 font-bold">#{index + 1}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alimentos Mais Doados */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  📦 Alimentos Mais Doados
                </h3>
                <p className="text-gray-600 text-sm mb-6">Os itens mais recebidos</p>
                
                <div className="space-y-3">
                  {topFoods.map((food, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{food.name}</p>
                        <p className="text-gray-500 text-xs">{food.quantity} {food.unit}</p>
                      </div>
                      {/* Barra de progresso visual */}
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(food.quantity / topFoods[0].quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Doações */}
          <Card className="bg-white border border-gray-200 shadow-md">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico de Doações</h3>
              <p className="text-gray-600 text-sm mb-6">Página {currentPage} de {totalPages} • Total: {ongDonations.length} doações</p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">ID</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Itens Recebidos</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-600 text-sm">Doador</th>
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
                          <td className="py-4 px-3 text-gray-600 text-sm">{donation.donor}</td>
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
                        <td colSpan={5} className="py-12 text-center text-gray-500">
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
                    Mostrando {startIndex + 1} a {Math.min(endIndex, ongDonations.length)} de {ongDonations.length} doações
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

