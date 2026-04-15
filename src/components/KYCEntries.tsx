"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    PENDING: "bg-yellow-400",
    VERIFIED: "bg-green-400",
    REJECTED: "bg-red-400",
};

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

    const router = useRouter();

    useEffect(() => {
        const fetchKycs = async () => {
            try {
                setLoading(true);
                setKycs([]);

                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("limit", "20");

                if (statusFilter !== "all") {
                    params.append("status", statusFilter.toUpperCase());
                }

                if (accountTypeFilter !== "all") {
                    params.append("type", accountTypeFilter.toUpperCase());
                }

                const res = await fetchWithAuth(
                    `/api/admin/kyc?${params.toString()}`,
                    { credentials: "include" }
                );

                const data = await res.json();

                if (data.success) {
                    setKycs(data.data);
                    setTotalPages(data.pagination.totalPages);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchKycs();
    }, [statusFilter, accountTypeFilter, page]);

    if (loading) return <InProgress message="Loading KYC records" />;
    if (!kycs.length) return <p>No KYC submissions currently.</p>;

    return (
        <div className="grid gap-2 md:gap-4">
            {kycs.map((kyc) => (
                <div
                    key={kyc.id}
                    onClick={() =>
                        router.push(`/dashboard/admin/kyc/${kyc.type.toLowerCase()}/${kyc.id}`)
                    }
                    className="p-4 hover:outline cursor-pointer hover:outline-my-gray/15 shadow-lg shadow-my-gray/5 rounded-xl flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{kyc.name}</p>

                        <div className="text-sm text-gray-500 flex items-center gap-3">
                            <p>{kyc.type}</p>

                            <span className="flex items-center gap-1">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        statusColors[kyc.status] || "bg-gray-400"
                                    }`}
                                />
                                <p>{kyc.status}</p>
                            </span>
                        </div>

                        {kyc.email && (
                            <p className="text-sm text-gray-400">{kyc.email}</p>
                        )}
                    </div>

                    <p className="text-sm text-gray-400">
                        {new Date(kyc.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
}