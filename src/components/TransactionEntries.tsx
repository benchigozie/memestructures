"use client";

import { useEffect, useState } from "react";
import InProgress from "./InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useRouter } from "next/navigation";

type Transaction = {
  id: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL" | "RETURN";
  intent: string;
  status: string;
  createdAt: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-400",
  COMPLETED: "bg-green-400",
  REJECTED: "bg-red-400",
  FAILED: "bg-red-500",
};

export default function TransactionEntries({
  statusFilter,
  typeFilter,
}: {
  statusFilter: "all" | "pending" | "verified" | "rejected";
  typeFilter: "all" | "deposit" | "withdrawal" | "return";
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", "20");

        if (statusFilter !== "all") {
          params.append(
            "status",
            statusFilter === "verified"
              ? "COMPLETED"
              : statusFilter.toUpperCase()
          );
        }

        if (typeFilter !== "all") {
          params.append("type", typeFilter.toUpperCase());
        }

        const res = await fetchWithAuth(
          `/api/admin/transactions?${params.toString()}`
        );

        const data = await res.json();

        if (data.success) {
          setTransactions(data.data);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [statusFilter, typeFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter]);

  if (loading) {
    return <InProgress message="Loading transactions" />;
  }

  if (!transactions.length) {
    return (
      <p className="text-gray-500">
        No Transactions found.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          onClick={() =>
            router.push(
              `/dashboard/admin/payments/${tx.id}`
            )
          }
          className="p-4 rounded-xl cursor-pointer shadow-lg shadow-my-gray/5 outline outline-my-gray/10 hover:outline-my-gray/30 hover:cursor-pointer transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {tx.user.name}
              </p>

              <p className="text-sm text-gray-400">
                {tx.user.email}
              </p>

              <div className="flex items-center gap-3 mt-1 text-sm">
                <p>{tx.type}</p>

                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusColors[tx.status] || "bg-gray-400"
                    }`}
                  />

                  <p>{tx.status}</p>
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${tx.amount.toLocaleString()}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 rounded-lg cursor-pointer hover:bg-my-gray/10 duration-300 transition-colors outline outline-my-gray/20 disabled:opacity-50"
          >
            Previous
          </button>

          <p className="px-3 py-2">
            {page} / {totalPages}
          </p>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg cursor-pointer hover:bg-my-gray/10 duration-300 transition-colors outline outline-my-gray/20 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}