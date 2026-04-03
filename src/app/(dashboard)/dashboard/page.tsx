"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ChooseUsername from "@/components/ChooseUsername";
//import InProgress from "@/components/InProgress";
import AccountType from "@/components/AccountType";
import KYC from "@/components/KYC";
export default function Dashboard() {

  const { user, loading, logout } = useAuth();
  const Router = useRouter();

  //if (loading) return < />;

  if (!user) {
    Router.replace("/login");
    return null;
  }

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