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
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return (
    <InProgress message="Loading your dashboard"/>
  );

  if (!user) router.replace("/login");

  console.log("this is user in dashboard: ", user);

  
  if (user && !user?.username) {
    return <ChooseUsername />;
  }

  if (!user?.accountType) {
    return <AccountType />;
  }

  if (user.kycStatus !== "VERIFIED" && user.accountType === "INDIVIDUAL") {
    return (
      <EnterpriseKYC/>
    );
  }

  if (user.kycStatus !== "VERIFIED" && user.accountType === "ENTERPRISE") {
    return (
      <EnterpriseKYC />
    );
  }




  return (
    <div>
      <h1>Welcome {user?.email}</h1>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};