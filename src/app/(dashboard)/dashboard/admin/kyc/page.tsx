"use client";

import InProgress from "@/components/InProgress";
import KYCEntries from "@/components/KYCEntries";
import { Suspense, useState } from "react";

export default function page() {

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState<"all" | "individual" | "enterprise">("all");


  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-my-deep-blue">
        KYC Review
      </h1>

      <div className="mt-2 md:mt-4">
        <p className="text-sm text-gray-500 mb-2">Status</p>
        <div className="flex gap-1.5 md:gap-3 text-sm md:text-base">
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${statusFilter === "all" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setStatusFilter("all")}>All</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${statusFilter === "pending" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setStatusFilter("pending")}>Pending</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${statusFilter === "verified" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setStatusFilter("verified")}>Verified</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${statusFilter === "rejected" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setStatusFilter("rejected")}>Rejected</button>
        </div>
      </div>

      <div className="mt-3 md:mt-6">
        <p className="text-sm text-gray-500 mb-2">Account Type</p>
        <div className="flex gap-1.5 md:gap-3 text-sm md:text-base">
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${accountTypeFilter === "all" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setAccountTypeFilter("all")}>All</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${accountTypeFilter === "individual" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setAccountTypeFilter("individual")}>Individual</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${accountTypeFilter === "enterprise" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setAccountTypeFilter("enterprise")}>Enterprise</button>
        </div>
      </div>

      <div className="mt-4 md:mt-8 grid gap-4">
        <Suspense fallback={<InProgress />}>
          <KYCEntries statusFilter={statusFilter}
            accountTypeFilter={accountTypeFilter} />
        </Suspense>
      </div>
    </div>
  );
}