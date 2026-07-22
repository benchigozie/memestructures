"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const page = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);

        const [walletRes, transactionRes] = await Promise.all([
          fetchWithAuth("/api/user/wallet"),
          fetchWithAuth("/api/user/wallet/transactions?limit=10"),
        ]);

        const walletData = await walletRes.json();
        const transactionData = await transactionRes.json();

        if (walletData.success) {
          setBalance(walletData.wallet.balance);
        }

        if (transactionData.success) {
          setTransactions(transactionData.transactions);
        }

      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl">
        <section className="flex flex-col gap-4 mb-6">
          <h1 className="text-xl md:text-3xl text-my-deep-blue font-bold mb-1 text-center">
            Available Balance
          </h1>

          <div className="text-3xl md:text-5xl text-my-white mb-1 text-center p-12 bg-linear-to-r from-my-blue to-my-deep-blue rounded-xl shadow-lg">
            <p>
              {loading
                ? "Loading..."
                : `$${balance.toLocaleString()}`}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 mb-6">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <Link
              href="/dashboard/user/wallet/fund-wallet"
              className="text-center rounded-lg bg-my-deep-blue p-2 text-my-white hover:bg-my-blue duration-300 transition-colors cursor-pointer"
            >
              Fund Wallet
            </Link>

            <Link
              href="/dashboard/user/wallet/fund-asset"
              className="text-center rounded-lg bg-my-deep-blue p-2 text-my-white hover:bg-my-blue duration-300 transition-colors cursor-pointer"
            >
              Fund Asset Class
            </Link>

{/*
            <Link
              href="/dashboard/user/wallet/withdraw"
              className="text-center rounded-lg bg-my-deep-blue p-2 text-my-white hover:bg-my-blue duration-300 transition-colors cursor-pointer"
            >
              Withdraw
            </Link>
            */}
          </div>
        </section>

        <section className="flex flex-col gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl text-my-deep-blue font-medium mb-2">
              Recent Transactions
            </h2>

            <div className="bg-my-white rounded-lg shadow-md shadow-my-gray/10 p-4 md:p-6 border border-gray-100">
              {transactions.length === 0 ? (
                <p className="text-gray-600">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3"
                    >
                      <div>
                        <p className="font-medium text-my-deep-blue">
                        {transaction.intent === "DIRECT_INVESTMENT"
                            ? "Direct Investment"
                            : transaction.intent === "WALLET_FUNDING"
                              ? "Wallet Funding"
                              : transaction.intent === "WALLET_INVESTMENT" ? "Asset Funding through Wallet" : "Withdrawal"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          ${transaction.amount.toLocaleString()}
                        </p>

                        <p
                          className={`text-sm ${transaction.status === "COMPLETED"
                            ? "text-green-500"
                            : transaction.status === "PENDING"
                              ? "text-yellow-500"
                              : "text-red-500"
                            }`}
                        >
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/dashboard/user/transactions"
                className="inline-block mt-4 duration-300 transition-colors text-my-blue hover:text-my-deep-blue"
              >
                View All Transactions →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;