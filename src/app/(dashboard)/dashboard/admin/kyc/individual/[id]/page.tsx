"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import { RenderFile } from "@/components/RenderFile";
import { ArrowLeft } from "lucide-react";

export default function IndividualKycPage() {
    const { id } = useParams();
    const router = useRouter();

    const [kyc, setKyc] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const updateStatus = async (status: "VERIFIED" | "REJECTED") => {
        try {
            const res = await fetchWithAuth(
                `/api/admin/kyc/individual/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (data.success) {
                setKyc((prev: any) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        kycStatus: status,
                    },
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchKyc = async () => {
            try {
                setLoading(true);

                const res = await fetchWithAuth(
                    `/api/admin/kyc/individual/${id}`,
                    { credentials: "include" }
                );

                const data = await res.json();

                if (data.success) {
                    console.log("Fetched KYC data:", data.data);
                    setKyc(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchKyc();
    }, [id]);

    if (loading) return <InProgress message="Loading KYC..." />;

    if (!kyc) return <p className="p-4 md:p-6">KYC not found</p>;

    return (
        <div className="p-4 md:p-6 space-y-6">

            <div className="flex justify-between items-start">
                <button
                    onClick={() => router.back()}
                    className="hidden md:flex gap-1 items-center text-sm cursor-pointer bg-my-blue text-my-white shadow-md shadow-my-gray/10 rounded-md px-4 py-2 hover:bg-gray-200 hover:text-my-deep-blue transition-all duration-300"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <span className="text-xs text-my-white px-4 py-2 rounded bg-gray-800">
                    {kyc.user.kycStatus}
                </span>
            </div>

            <div className="space-y-1">
                <div>
                    <h1 className="text-2xl font-bold text-my-deep-blue">
                        KYC Details
                    </h1>
                </div>
                <div className="flex gap-2 items-center mt-4">
                    <h2 className="font-medium">
                        Name:
                    </h2>
                    <p>{kyc.firstName} {kyc.lastName}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h2 className="font-medium">
                        Email:
                    </h2>
                    <p>{kyc.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h2 className="font-medium">
                        Phone:
                    </h2>
                    <p>{kyc.phone}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-my-deep-blue">Identity</h3>
                <div className="flex gap-2 items-center">
                    <h3 className="font-medium">
                        Identify Type:
                    </h3>
                    <p>{kyc.idType}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="font-medium">
                        Identify Number:
                    </h3>
                    <p>{kyc.idNumber}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">
                        Identify Files:
                    </h3>
                    <div className="flex gap-4 flex-col mt-5">
                        <div>
                            <RenderFile url={kyc.files.idFrontUrl} label="Front of ID" />
                        </div>
                        <div>
                            <RenderFile url={kyc.files.idBackUrl} label="Backt of ID" />
                        </div>
                        <div>
                            <RenderFile url={kyc.files.selfieUrl} label="Selfie With ID" />
                        </div>
                    </div>
                </div>

            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-my-deep-blue">Address</h3>
                <p>{kyc.address}, {kyc.city}, {kyc.state}, {kyc.country}</p>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">
                        Proof of Residence Document:
                    </h3>
                    <div className="flex gap-4 flex-col mt-5">
                        <div>
                            <RenderFile url={kyc.files.residenceUrl} label="Proof of Residence" />
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => updateStatus("VERIFIED")}
                    className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 cursor-pointer"
                >
                    Verify
                </button>

                <button
                    onClick={() => updateStatus("REJECTED")}
                    className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 cursor-pointer"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}