"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserNav from "@/components/UserNav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            const isAllowed =
                user?.accountType === "INDIVIDUAL" ||
                user?.accountType === "ENTERPRISE";

            if (!user || !isAllowed) {
                router.replace("/login");
            }
        }
    }, [user, loading, router]);

    if (loading) return null;

    const isAllowed =
        user?.accountType === "INDIVIDUAL" ||
        user?.accountType === "ENTERPRISE";

    if (!user || !isAllowed) return null;

    return (
        <>
            <UserNav />
            <main className="lg:ml-56 mt-15">{children}</main>
        </>
    );
}