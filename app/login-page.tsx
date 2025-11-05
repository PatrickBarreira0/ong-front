"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import SelectUserTypeModal from "@/components/modals/SelectUserTypeModal";
import SignupONGForm from "@/components/forms/SignupONGForm";
import SignupDonorForm from "@/components/forms/SignupDonorForm";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUserType } = useAuth();
  const [showSelectUserType, setShowSelectUserType] = useState(false);
  const [signupType, setSignupType] = useState<"ong" | "donor" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    setShowSelectUserType(true);
  };

  const handleSelectUserType = (type: "ong" | "donor") => {
    setSignupType(type);
    setShowSelectUserType(false);
  };

  const handleBackToLogin = () => {
    setSignupType(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implementar autenticação real com backend
    // Por enquanto, vamos simular baseado no email
    
    // Simulação: determinar userType baseado no email
    let determinedUserType: "donor" | "ong" | "admin" = "donor";
    
    if (email.includes("admin")) {
      determinedUserType = "admin";
    } else if (email.includes("ong")) {
      determinedUserType = "ong";
    }

    // Salvar userType no contexto
    setUserType(determinedUserType);

    // Redirecionar baseado no tipo de usuário
    switch (determinedUserType) {
      case "donor":
        router.push("/dashboard");
        break;
      case "ong":
        router.push("/dashboard-ong");
        break;
      case "admin":
        router.push("/dashboard-admin");
        break;
    }
  };

  if (signupType === "ong") {
    return <SignupONGForm onBack={handleBackToLogin} />;
  }

  if (signupType === "donor") {
    return <SignupDonorForm onBack={handleBackToLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
      {/* Modal de seleção de tipo de usuário */}
      <SelectUserTypeModal
        open={showSelectUserType}
        onClose={() => setShowSelectUserType(false)}
        onSelectONG={() => handleSelectUserType("ong")}
        onSelectDonor={() => handleSelectUserType("donor")}
      />

      {/* Card de Login */}
      <Card className="w-full max-w-md bg-gradient-to-b from-blue-50 to-white border-0 shadow-lg">
        <CardContent className="pt-8 pb-12 px-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de gerenciamento de doações
              </h1>
            </div>

            {/* Email */}
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 rounded-lg"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 rounded-lg"
                required
              />
            </div>

            {/* Botão Login */}
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition-all mt-6"
            >
              Entrar
            </Button>

            {/* Botão de Cadastro */}
            <Button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 rounded-lg border border-gray-200 transition-colors"
              onClick={handleCreateAccount}
            >
              Criar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
