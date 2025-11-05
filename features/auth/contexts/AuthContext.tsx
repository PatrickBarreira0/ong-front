"use client";
// ALTERAR COMPLETAMENTE COM A NOVA LOGICA DE ROLE
import { createContext, useContext, useState, ReactNode } from "react";

type UserType = "donor" | "ong" | "admin";

interface AuthContextType {
  userType: UserType | null;
  setUserType: (type: UserType | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserTypeState] = useState<UserType | null>(null);

  const setUserType = (type: UserType | null) => {
    setUserTypeState(type);
    if (type) {
      localStorage.setItem("userType", type);
    } else {
      localStorage.removeItem("userType");
    }
  };

  const logout = () => {
    setUserTypeState(null);
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ userType, setUserType, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

