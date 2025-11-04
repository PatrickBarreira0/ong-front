"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { useState } from "react";

const FOODS = [
  "Arroz",
  "Feijão",
  "Macarrão",
  "Leite",
  "Pão",
  "Óleo",
  "Açúcar",
  "Sal",
  "Café",
  "Acucar",
];

const ONGS = [
  { id: 1, name: "Comunidade Solidária", address: "Rua das Flores, 123" },
  { id: 2, name: "Anjos da Noite", address: "Avenida Principal, 456" },
  { id: 3, name: "Esperança Viva", address: "Praça Central, 789" },
];

interface DonationItem {
  food: string;
  quantity: number;
  unit: string;
}

export default function DonatePage() {
  const [selectedOng, setSelectedOng] = useState<number | null>(null);
  const [items, setItems] = useState<DonationItem[]>([
    { food: "", quantity: 0, unit: "kg" },
  ]);

  const handleAddItem = () => {
    setItems([...items, { food: "", quantity: 0, unit: "kg" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof DonationItem,
    value: string | number
  ) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field as keyof Omit<DonationItem, 'quantity'>] = value as string;
    }
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!selectedOng) {
      alert("Por favor, selecione uma ONG");
      return;
    }

    const validItems = items.filter((item) => item.food && item.quantity > 0);
    if (validItems.length === 0) {
      alert("Por favor, adicione pelo menos um item válido");
      return;
    }

    alert(
      `Doação enviada!\n\nONG: ${
        ONGS.find((o) => o.id === selectedOng)?.name
      }\nItens: ${validItems.map((i) => `${i.food} (${i.quantity} ${i.unit})`).join(", ")}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      {/* Sidebar */}
      <Sidebar activePage="donate" />

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Fazer uma Doação</h2>
            <p className="text-gray-600 mt-1">Contribua com alimentos para as ONGs parceiras.</p>
          </div>

          <Button
            onClick={() => alert("Logout realizado!")}
            className="bg-gray-900 hover:bg-black text-white font-medium px-4 py-2 rounded-lg"
          >
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-4xl">
            {/* Seleção de ONG */}
            <Card className="bg-white border border-gray-200 shadow-md mb-8">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Selecione a ONG Destino</h3>
                <p className="text-gray-600 text-sm mb-6">Escolha uma das ONGs parceiras para receber sua doação.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ONGS.map((ong) => (
                    <button
                      key={ong.id}
                      onClick={() => setSelectedOng(selectedOng === ong.id ? null : ong.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedOng === ong.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            selectedOng === ong.id
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedOng === ong.id && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ong.name}</p>
                          <p className="text-sm text-gray-500">{ong.address}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itens de Doação */}
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Itens da Doação</h3>
                <p className="text-gray-600 text-sm mb-6">Adicione os alimentos que deseja doar.</p>

                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-end pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alimento
                        </label>
                        <select
                          value={item.food}
                          onChange={(e) => handleItemChange(index, "food", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um alimento</option>
                          {FOODS.map((food) => (
                            <option key={food} value={food}>
                              {food}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div className="w-28">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unidade
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="kg">kg</option>
                          <option value="L">L</option>
                          <option value="unidades">unidades</option>
                        </select>
                      </div>

                      {items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-gray-400 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Adicionar Outro Item
                </button>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
              >
                ✓ Enviar Doação
              </Button>
              <Button
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg"
              >
                ✕ Cancelar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
