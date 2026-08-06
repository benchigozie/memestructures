"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import InProgress from "@/components/InProgress";

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

  if (loading) return <InProgress message="Loading your dashboard" />;

  const isAllowed =
    user?.accountType === "ADMIN" || user?.accountType === "DEV";

  if (!user || !isAllowed) return null;

  return (
    <>
        <AdminNav />
        <main className="lg:ml-56 mt-15">{children}</main>
      </>
  );
}