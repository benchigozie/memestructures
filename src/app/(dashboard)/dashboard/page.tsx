"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function Dashboard () {

  const { user, loading, logout } = useAuth();
  const Router = useRouter();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    Router.push("/login");
  }

  return (
    <div>
      <h1>Welcome Mr Barbie</h1>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};