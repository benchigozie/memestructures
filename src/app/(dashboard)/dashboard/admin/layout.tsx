"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAllowed =
        user?.accountType === "ADMIN" || user?.accountType === "DEV";

      if (!user || !isAllowed) {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading) return null;

  const isAllowed =
    user?.accountType === "ADMIN" || user?.accountType === "DEV";

  if (!user || !isAllowed) return null;

  return (
    <>
        <AdminNav />
        <main className="md:ml-52 mt-14 md:mt-0">{children}</main>
      </>
  );
}