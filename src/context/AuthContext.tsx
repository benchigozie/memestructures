"use client";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  initials: string;
  accountType: "INDIVIDUAL" | "ENTERPRISE" | "ADMIN" | "DEV";
  kycStatus: "UNVERIFIED" | "VERIFIED" | "PENDING" | "REJECTED" | "UNCOMPLETED";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);

      try {
        const res = await fetchWithAuth("/api/auth/me");

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        setUser({
          ...data.user,
          initials: getInitials(data.user.name),

        });

      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    console.log("AuthProvider:", { loading, user });
  }, [loading, user]);

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