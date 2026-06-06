"use client"

import { useAuth } from "@/context/AuthContext"
import { Layers2, Landmark, MonitorDot, CircleDollarSign } from "lucide-react"
import AssetChart from "@/components/AssetChart"
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import InProgress from "@/components/InProgress"

const page = () => {

  console.log("Rendering Dashboard Overview Page");

  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetchWithAuth("/api/dashboard");
      const data = await res.json();

      setDashboardData(data);
      console.log("Fetched dashboard data:", data);
    };

    fetchDashboard();
  }, []);

  if (!dashboardData) {
    return (
      <InProgress message="Loading Your Dashboard" />
    );
  }

  const orderStatus =
    dashboardData.assetClasses > 0 ? "Active" : "Inactive";

  return (
    <div className="p-4 md:p-8">
      <div className="rounded-lg max-w-6xl">

        <section className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl md:text-3xl text-my-deep-blue font-bold">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
          <p>Here's an Overview of Your Account</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
          <div className="flex flex-col gap-4">
            <div className="bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <p>Number of Asset Classes Funded</p>
                <p className="text-my-blue text-2xl md:text-4xl semi-bold">
                  {dashboardData.assetClasses}
                </p>
              </div>
              <div className="p-3 bg-my-blue-white/60 rounded-lg text-my-deep-blue">
                <Layers2 size={22}/>
              </div>
            </div>
            <div className="bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <p>Capital Invested</p>
                <p className="text-my-blue text-2xl semi-bold">
                  ${dashboardData.totalInvested.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-my-blue-white rounded-lg text-my-deep-blue">
                <Landmark size={22}/>
              </div>
            </div>
            <div className="bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <p>Order Status</p>
                <p className="text-my-blue text-2xl md:text-3xl semi-bold">
                  {orderStatus}
                </p>
              </div>
              <div className="p-3 bg-my-blue-white rounded-lg text-my-deep-blue">
              <MonitorDot size={22}/>
              </div>
            </div>
            <div className="bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <p>Available Balance</p>
                <p className="text-my-blue text-2xl semi-bold">
                  ${dashboardData.walletBalance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-my-blue-white rounded-lg text-my-deep-blue">
              <CircleDollarSign size={22}/>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg">
            <div className=" flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p>Portfolio Allocation</p>
                <p className="text-my-deep-blue text-2xl semi-bold">
                  Asset Distribution
                </p>
              </div>
            </div>
            <div className="">
              <div className="">

                 {
                dashboardData.allocation.length === 0 ? (
                  <div className="w-full h-75 flex items-center justify-center">
                    <p className="text-gray-500">No Asset Allocation Data Available</p>
                  </div>) : (
                    ""
                  )
                }
                <AssetChart data={dashboardData.allocation} />

              </div>
            </div>
          </div>

        </section>
        {/*
        <section className="mt-10">
          <h2>
            Recent Activity
          </h2>
          <div className="flex flex-col gap-4 bg-white shadow-md shadow-my-gray/5 p-6 rounded-lg">
          </div>
        </section>
        */
}
      </div>
    </div>
  )
}

export default page