"use client";

import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { useSetUserRole } from "@/features/auth/hooks/useSetUserRole";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCNPJ } from "@/lib/format";

export default function SignupONGPage() {
  const { signUp, isPending: isSigningUp } = useSignUp();
  const { setUserRole, isPending: isSettingRole } = useSetUserRole();
  const [formData, setFormData] = useState({
    email: "",
    ongName: "",
    cnpj: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.ongName) {
      newErrors.ongName = "Nome da ONG é obrigatório";
    }

    if (!formData.cnpj) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Senhas não conferem";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    signUp(
      {
        email: formData.email,
        password: formData.password,
        username: formData.ongName,
        documento: formData.cnpj,
      },
      {
        onSuccess: (data: any) => {
          const jwt = data?.jwt;
          if (jwt) {
            setUserRole(
              { role: "Ong", jwt },
              {
                onSuccess: () => {
                },
                onError: (error) => {
                  console.error("Erro ao atribuir role:", error);
                  setErrors({ submit: "Erro ao finalizar cadastro. Tente novamente." });
                },
              }
            );
          } else {
            setErrors({ submit: "Erro ao obter token. Tente novamente." });
          }
        },
        onError: (error) => {
          console.error("Erro ao cadastrar:", error);
          setErrors({ submit: "Erro ao cadastrar. Tente novamente." });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-blue-50 to-white border-0 shadow-lg">
        <CardContent className="pt-8 pb-12 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Cadastro de ONG
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados abaixo para se cadastrar
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.email ? "focus:ring-red-300" : "focus:ring-blue-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da ONG
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
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
                <Input
                  type="text"
                  name="ongName"
                  value={formData.ongName}
                  onChange={handleChange}
                  placeholder="Nome da sua organização"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.ongName ? "focus:ring-red-300" : "focus:ring-blue-300"
                  }`}
                />
              </div>
              {errors.ongName && (
                <p className="text-red-500 text-sm mt-1">{errors.ongName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <Input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.cnpj ? "focus:ring-red-300" : "focus:ring-blue-300"
                  }`}
                />
              </div>
              {errors.cnpj && (
                <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.password ? "focus:ring-red-300" : "focus:ring-blue-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <Input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Confirmar senha"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.passwordConfirm
                      ? "focus:ring-red-300"
                      : "focus:ring-blue-300"
                  }`}
                />
              </div>
              {errors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-8">
              <Link href="/signin" className="flex-1">
                <Button
                  type="button"
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 rounded-lg border border-gray-200 transition-colors"
                >
                  Voltar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSigningUp || isSettingRole}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSigningUp || isSettingRole ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
