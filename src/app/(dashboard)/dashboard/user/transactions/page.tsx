"use client";

import InProgress from '@/components/InProgress';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useEffect, useState } from 'react';

type Transaction = {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "RETURN";
  intent: string;
  amount: number;
  status: string;
  createdAt: string;

  investment?: {
    id: string;
    fund?: {
      name: string;
      acronym: string | null;
    } | null;
  } | null;
};

const page = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();

  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetchWithAuth("/api/user/wallet/transactions?limit=20");

      if (!res.ok) {
        throw new Error("Failed to fetch Transactions");
      }

      const data = await res.json();

      setTransactions(data.transactions);
      setNextCursor(data.nextCursor);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!nextCursor) return;

    try {
      const res = await fetchWithAuth(
        `/api/user/wallet/transactions?limit=20&cursor=${nextCursor}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Transactions");
      }

      const data = await res.json();

      setTransactions(prev => [
        ...prev,
        ...data.transactions,
      ]);

      setNextCursor(data.nextCursor);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="p-4">
        <div className="max-w-2xl">
          <section className="flex flex-col gap-4 mb-6">
            <h1 className="text-xl md:text-3xl text-my-deep-blue font-bold mb-1 text-center">
              Transaction History
            </h1>

            {loading && (
              <InProgress message="Loading notifications" />
            )}

            {!loading && transactions.length === 0 && (
              <p className="text-center text-gray-500">
                No Transactions Yet.
              </p>
            )}

            {transactions.length > 0 && (
              <div className="flex flex-col gap-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-my-gray/10 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-my-deep-blue">
                          {transaction.intent === "DIRECT_INVESTMENT"
                            ? "Direct Investment"
                            : transaction.intent === "WALLET_FUNDING"
                              ? "Wallet Funding"
                              : transaction.intent === "WALLET_INVESTMENT" ? "Asset Funding through Wallet" : "Withdrawal"}
                        </h3>

                        {transaction.investment?.fund && (
                          <p className="text-sm text-gray-500">
                            {transaction.investment.fund.acronym ??
                              transaction.investment.fund.name}
                          </p>
                        )}

                        <small className="text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </small>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-my-deep-blue">
                          ${transaction.amount.toLocaleString()}
                        </p>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${transaction.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : transaction.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {nextCursor && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreTransactions}
                  className="bg-my-blue text-white hover:bg-my-deep-blue cursor-pointer duration-300 transition-colors px-4 py-2 rounded-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default page