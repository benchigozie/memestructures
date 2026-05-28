"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChooseUsername from "@/components/ChooseUsername";
//import InProgress from "@/components/InProgress";
import AccountType from "@/components/AccountType";
import IndividualKYC from "@/components/IndividualKYC";
import InProgress from "@/components/InProgress";
import EnterpriseKYC from "@/components/EnterpriseKYC";


export default function Dashboard() {

  const { user, loading, logout } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (loading) return;
  
    console.log("Dashboard useEffect - user:", user);

    if (!user) {
      router.replace("/login");
      return;
    }
  
    if (user.accountType === "ADMIN" || user.accountType === "DEV") {
      router.replace("/dashboard/admin");
      return;
    }
  
    if (user.username && user.accountType && user.kycStatus === "VERIFIED") {
      router.replace("/dashboard/user/overview");
    }
  }, [user, loading, router]);

  if (loading) return (
    <InProgress message="Loading your dashboard"/>
  );


  if (!user) return null;

  console.log("this is user in dashboard: ", user);

  
  if (user && (user.accountType === "INDIVIDUAL" || user.accountType === "ENTERPRISE" ) && !user?.username) {
    return <ChooseUsername />;
  }

  if (!user?.accountType) {
    return <AccountType />;
  }

  if (user.kycStatus !== "VERIFIED" && user.accountType === "INDIVIDUAL") {
    return (
      <IndividualKYC/>
    );
  }

  if (user.kycStatus !== "VERIFIED" && user.accountType === "ENTERPRISE") {
    return (
      <EnterpriseKYC />
    );
  }



  return  null;
};