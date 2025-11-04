"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SelectUserTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectONG: () => void;
  onSelectDonor: () => void;
}

export default function SelectUserTypeModal({
  open,
  onClose,
  onSelectONG,
  onSelectDonor,
}: SelectUserTypeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tipo de Cadastro
            </h2>
            <p className="text-gray-600">
              Escolha qual tipo de conta você gostaria de criar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={onSelectONG}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0cm0 1.552-.121 3.075-.352 4.592M9 21m0 0H4m9 0h5m-9 0cm0 1.552.121 3.075.352 4.592M9 3h.01M9 9h.01M9 15h.01M12 9h.01M15 9h.01M12 15h.01"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Organização (ONG)
              </h3>
              <p className="text-sm text-gray-600">
                Para organizações que desejam receber doações
              </p>
            </button>

            <button
              onClick={onSelectDonor}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Doador
              </h3>
              <p className="text-sm text-gray-600">
                Para pessoas que desejam fazer doações
              </p>
            </button>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-8 py-2 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
