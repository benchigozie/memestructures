"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChooseUsername from "@/components/ChooseUsername";
//import InProgress from "@/components/InProgress";
import AccountType from "@/components/AccountType";
import KYC from "@/components/KYC";
import InProgress from "@/components/InProgress";


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


  console.log("this is user in dashboard: ", user);

  if (!user?.username) {
    return <ChooseUsername />;
  }

  if (!user.accountType) {
    return <AccountType />;
  }

  if (user.kycStatus !== "VERIFIED") {
    return (
      <KYC />
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