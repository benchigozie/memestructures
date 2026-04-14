"use client";

import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/context/AuthContext";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.accountType !== "ADMIN") {
    return null; 
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 ml-52">{children}</main>
    </div>
  );
}