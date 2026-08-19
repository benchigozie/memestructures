
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ChooseUsername from "@/components/ChooseUsername";
import AccountType from "@/components/AccountType";
import IndividualKYC from "@/components/IndividualKYC";
import InProgress from "@/components/InProgress";
import EnterpriseKYC from "@/components/EnterpriseKYC";
import KYCStatus from "@/components/KYCStatus";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    /**
     * Decide where an authenticated user should go.
     *
     * This is the ONLY place in this page that performs navigation.
     */
    useEffect(() => {
        if (loading) {
            return;
        }

        // No authenticated user
        if (!user) {
            router.replace("/login");
            return;
        }

        // Admin / Developer
        if (
            user.accountType === "ADMIN" ||
            user.accountType === "DEV"
        ) {
            router.replace("/dashboard/admin/kyc");
            return;
        }

        // Fully onboarded and verified user
        if (
            user.username &&
            user.accountType &&
            user.kycStatus === "VERIFIED"
        ) {
            router.replace("/dashboard/user/overview");
            return;
        }
    }, [user, loading, router]);

    if (loading) {
        return <InProgress message="Loading your account" />;
    }

    if (!user) {
        return null;
    }

    if (
        (user.accountType === "INDIVIDUAL" ||
            user.accountType === "ENTERPRISE") &&
        !user.username
    ) {
        return <ChooseUsername />;
    }
   
    if (!user.accountType) {
        return <AccountType />;
    }

    if (
        user.accountType === "INDIVIDUAL" &&
        (
            user.kycStatus === "UNVERIFIED" ||
            user.kycStatus === "UNCOMPLETED"
        )
    ) {
        return <IndividualKYC />;
    }

    /**
     * Individual KYC is currently pending
     * or has been rejected.
     */
    if (
        user.accountType === "INDIVIDUAL" &&
        (
            user.kycStatus === "PENDING" ||
            user.kycStatus === "REJECTED"
        )
    ) {
        return <KYCStatus status={user.kycStatus}/>;
    }

    /**
     * Enterprise user still needs to complete
     * or resolve KYC.
     */
    if (
        user.accountType === "ENTERPRISE" &&
        user.kycStatus !== "VERIFIED"
    ) {
        return <EnterpriseKYC />;
    }

    /**
     * A verified user will already have been redirected
     * to /dashboard/user/overview by the effect above.
     */
    return null;
}
