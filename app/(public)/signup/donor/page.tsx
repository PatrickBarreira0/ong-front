"use client";

import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { useSetUserRole } from "@/features/auth/hooks/useSetUserRole";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCPF } from "@/lib/format";
import { AlertCircle } from "lucide-react";

export default function SignupDonorPage() {
  const router = useRouter();
  const { signUp, isPending: isSigningUp } = useSignUp();
  const { setUserRole, isPending: isSettingRole } = useSetUserRole();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    cpf: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
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

    if (!formData.username) {
      newErrors.username = "Nome de usuário é obrigatório";
    } else if (formData.username.length < 3) {
      newErrors.username = "Nome de usuário deve ter pelo menos 3 caracteres";
    }

    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido (formato: XXX.XXX.XXX-XX)";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        username: formData.username,
        documento: formData.cpf,
      },
      {
        onSuccess: (data: any) => {
          const jwt = data?.jwt;
          if (jwt) {
            setUserRole(
              { role: "Donor", jwt },
              {
                onSuccess: () => {
                  router.push("/signin?signup=success");
                },
                onError: () => {
                  setErrors({ submit: "Erro ao finalizar cadastro. Tente novamente." });
                },
              }
            );
          } else {
            setErrors({ submit: "Erro ao obter token. Tente novamente." });
          }
        },
        onError: (error: any) => {
          const apiMessage =
            error?.response?.data?.error?.message ||
            error?.message ||
            "";
          if (typeof apiMessage === "string" && apiMessage.toLowerCase().includes("already taken")) {
            setErrors({ submit: "Email ou nome de usuário já está em uso." });
          } else {
            setErrors({ submit: "Erro ao cadastrar. Tente novamente." });
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-green-50 to-white border-0 shadow-lg">
        <CardContent className="pt-8 pb-12 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Cadastro de Doador
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
                    errors.email ? "focus:ring-red-300" : "focus:ring-green-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Seu nome de usuário"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.username ? "focus:ring-red-300" : "focus:ring-green-300"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
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
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="XXX.XXX.XXX-XX"
                  className={`pl-10 bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 rounded-lg ${
                    errors.cpf ? "focus:ring-red-300" : "focus:ring-green-300"
                  }`}
                />
              </div>
              {errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
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
                    errors.password ? "focus:ring-red-300" : "focus:ring-green-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

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
                      : "focus:ring-green-300"
                  }`}
                />
              </div>
              {errors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

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
