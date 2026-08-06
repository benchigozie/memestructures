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

  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard User:", JSON.stringify(user, null, 2));
    console.log("Loading:", loading);
  }, [user, loading])

  useEffect(() => {
    if (loading) {
      console.log("Dashboard useEffect - still loading, returning early");
      return
    };



    console.log("Dashboard useEffect - user:", user);

    if (!user) {
      console.log("No user found, redirecting to login");
      router.replace("/login");
      return;
    }

    if (user.accountType === "ADMIN" || user.accountType === "DEV") {
      console.log("User is admin or dev, redirecting to admin KYC page");
      router.replace("/dashboard/admin/kyc");
      return;
    }

    if (user.username && user.accountType && user.kycStatus === "VERIFIED") {
      console.log("User has username, account type, and is verified, redirecting to user overview");
      router.replace("/dashboard/user/overview");
    }
  }, [user, loading, router]);

  if (loading) return (
    console.log("Dashboard is loading 2, showing InProgress component"),
    <InProgress message="Loading your dashboard" />
  );


  if (!user) {
    console.log("No user found again, returning null");
    return null;
  };

  console.log("this is user in dashboard: ", user);


  if (user && (user.accountType === "INDIVIDUAL" || user.accountType === "ENTERPRISE") && !user?.username) {
    console.log("User is individual or enterprise and has no username, showing ChooseUsername component");
    return <ChooseUsername />;
  }

  if (!user?.accountType) {
    console.log("User has no account type, showing AccountType component");
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


  if (
    user.accountType === "INDIVIDUAL" &&
    (
      user.kycStatus === "PENDING" ||
      user.kycStatus === "REJECTED"
    )
  ) {
    return (
      <KYCStatus
        status={user.kycStatus}
      />
    );
  }

  if (user.kycStatus !== "VERIFIED" && user.accountType === "ENTERPRISE") {
    console.log("User is enterprise and not verified, showing EnterpriseKYC component");
    return (
      <EnterpriseKYC />
    );
  }

  return <InProgress message="Redirecting" />;
};