"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InProgress from "@/components/InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  intent: string;
  status: string;
  reference: string | null;
  proofPath: string | null;
  createdAt: string;
  proofUrl: string;
  wallet: {
    user: {
      id: string;
      name: string;
      email: string;
      accountType: string | null;
      createdAt: string;
    };
  };
};

export default function TransactionPage() {
  const params = useParams();

  const [transaction, setTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetchWithAuth(
          `/api/admin/transactions/${params.id}`
        );

        const data = await res.json();

        console.log("Transaction data: ", data);

        if (data.success) {
          setTransaction(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [params.id]);

  if (loading) {
    return (
      <InProgress message="Loading transaction..." />
    );
  }

  if (!transaction) {
    return (
      <div className="p-6">
        Transaction not found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-my-deep-blue">
        Transaction Details
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Transaction */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold mb-4">
            Transaction Information
          </h2>

          <div className="space-y-3">
            <Row
              label="Amount"
              value={`$${transaction.amount.toLocaleString()}`}
            />

            <Row
              label="Type"
              value={transaction.type}
            />

            <Row
              label="Intent"
              value={transaction.intent}
            />

            <Row
              label="Status"
              value={transaction.status}
            />

            <Row
              label="Reference"
              value={transaction.reference || "-"}
            />

            <Row
              label="Created"
              value={new Date(
                transaction.createdAt
              ).toLocaleString()}
            />

            <Row
              label="Transaction ID"
              value={transaction.id}
            />
          </div>
        </div>

        {/* User */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold mb-4">
            User Information
          </h2>

          <div className="space-y-3">
            <Row
              label="Name"
              value={transaction.wallet.user.name}
            />

            <Row
              label="Email"
              value={transaction.wallet.user.email}
            />

            <Row
              label="Account Type"
              value={
                transaction.wallet.user.accountType ||
                "-"
              }
            />

            <Row
              label="User ID"
              value={transaction.wallet.user.id}
            />

            <Row
              label="Joined"
              value={new Date(
                transaction.wallet.user.createdAt
              ).toLocaleDateString()}
            />
          </div>
        </div>
      </div>

      {transaction.proofPath && (
        <div className="bg-white rounded-xl p-5 shadow mt-6">
          <h2 className="font-semibold mb-4">
            Proof of Payment
          </h2>

          <img
            src={transaction.proofUrl}
            alt="Proof"
            className="max-h-150 rounded-lg border"
          />
        </div>
      )}

      {transaction.status === "PENDING" && (
        <div className="flex gap-3 mt-6">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Approve
          </button>

          <button
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-right break-all">
        {value}
      </span>
    </div>
  );
}