"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ChooseUsername from "@/components/ChooseUsername";
import Loading
  from "@/components/Loading";
export default function Dashboard() {

  const { user, loading, logout } = useAuth();
  const Router = useRouter();

  if (loading) return <Loading />;

  if (!user) {
    Router.replace("/login");
    return null;
  }

  if (!user?.username) {
    return <ChooseUsername />;
  }

  if (!user.accountType) {
    return
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