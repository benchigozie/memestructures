"use client";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  accountType: "INDIVIDUAL" | "ENTERPRISE" | "ADMIN" | "DEV";
  kycStatus: "UNVERIFIED" | "VERIFIED" | "PENDING" | "REJECTED";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetchWithAuth("/api/auth/me");


        if (!res.ok) {
          setUser(null);
          //logout();
          setLoading(false);
          
          return;
        }


        const data = await res.json();
        setUser(data.user);
        setLoading(false);


      } catch {
        setUser(null);
      }

      setLoading(false);
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};