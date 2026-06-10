"use client";

import InProgress from "@/components/InProgress";

import { Suspense, useState } from "react";
import TransactionEntries from "@/components/TransactionEntries";
import { useRouter } from "next/navigation";

export default function page() {

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "deposit" | "withdrawal" | "return">("all");


  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-my-deep-blue">
        User Payments
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
        <p className="text-sm text-gray-500 mb-2">Transaction Type</p>
        <div className="flex gap-1.5 md:gap-3 text-sm md:text-base">
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${typeFilter === "all" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setTypeFilter("all")}>All</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${typeFilter === "deposit" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setTypeFilter("deposit")}>Deposit</button>
          <button className={`outline outline-my-gray/20 rounded-full px-4 py-1 cursor-pointer ${typeFilter === "withdrawal" ? "bg-my-deep-blue text-my-white" : "hover:bg-gray-200"}`} onClick={() => setTypeFilter("withdrawal")}>Withdrawal</button>
        </div>
      </div>

      <div className="mt-4 md:mt-8 grid gap-4">
        <Suspense fallback={<InProgress />}>
          <TransactionEntries
            statusFilter={statusFilter}
            typeFilter={typeFilter}
          />
        </Suspense>
      </div>
    </div>
  );
}