"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    console.log("AdminGuard rendered");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AdminGuard useEffect - user:", user);
    if (!loading && (!user || user.accountType !== "ADMIN")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return <>{children}</>;
}