"use client";

import { useEffect, useState } from "react";
import InProgress from "./InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

type KYCEntry = {
    id: string;
    type: "INDIVIDUAL" | "ENTERPRISE";
    status: string;
    name: string;
    email: string | null;
    createdAt: string;
};

const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    VERIFIED: "text-green-400",
    REJECTED: "text-red-400",
}

export default function KYCEntries({
    statusFilter,
    accountTypeFilter,
}: {
    statusFilter: "all" | "pending" | "verified" | "rejected";
    accountTypeFilter: "all" | "individual" | "enterprise";
}) {
    const [kycs, setKycs] = useState<KYCEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const params = new URLSearchParams();

    useEffect(() => {
        const fetchKycs = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                params.append("page", page.toString());
                params.append("limit", "10");

                if (statusFilter !== "all") {
                    params.append("status", statusFilter.toUpperCase());
                }

                if (accountTypeFilter !== "all") {
                    params.append("type", accountTypeFilter.toUpperCase());
                }

                console.log("Fetching KYC with params:", params.toString());

                const res = await fetchWithAuth(`/api/admin/kyc?${params.toString()}`, {
                    credentials: "include",
                });

                console.log("Fetch response status:", res);


                const data = await res.json();

                if (data.success) {
                    setKycs(data.data);
                    setTotalPages(data.pagination.totalPages);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchKycs();
    }, [statusFilter, accountTypeFilter]);

    if (loading) {
        return <InProgress message="Loading KYC records" />;
    }

    if (!kycs.length) {
        return <p>There are no No KYC submissions currently.</p>;
    }

    return (
        <div className="grid gap-4">
            {kycs.map((kyc) => (
                <div
                    key={kyc.id}
                    className="p-4 hover:outline cursor-pointer hover:outline-my-gray/15 shadow-lg shadow-my-gray/5 rounded-xl flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{kyc.name}</p>

                        <p className="text-sm text-gray-500">
                            {kyc.type}   <span
                                className={`h-2 w-2 rounded-full ${statusColors[kyc.status] || "bg-gray-400"
                                    }`}></span>
                            {kyc.status}
                        </p>

                        {kyc.email && (
                            <p className="text-sm text-gray-400">{kyc.email}</p>
                        )}
                    </div>

                    <p className="text-sm text-gray-400">
                        {new Date(kyc.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
            <div className="flex items-center justify-between mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 ${page === 1 ? "cursor-not-allowed" : "hover:bg-my-deep-blue hover:text-my-white"}`}
                >
                    Previous
                </button>

                <p className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </p>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 transition-colors duration-300 ${ page === totalPages ? "cursor-not-allowed" : "hover:bg-my-deep-blue hover:text-my-white"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}