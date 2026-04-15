"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";

export default function EnterpriseKycPage() {
  const { id } = useParams();
  const router = useRouter();

  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setLoading(true);

        const res = await fetchWithAuth(
          `/api/admin/kyc/enterprise/${id}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.success) {
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

  if (loading) return <InProgress message="Loading Enterprise KYC..." />;

  if (!kyc) return <p className="p-4 md:p-6">KYC not found</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-white"
        >
          ← Back
        </button>

        <span className="text-sm px-3 py-1 rounded bg-gray-800">
          {kyc.status}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-semibold">{kyc.companyName}</h2>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Members</h3>

        <div className="space-y-4">
          {kyc.members.map((m: any) => (
            <div
              key={m.id}
              className="p-4 border border-gray-800 rounded-lg"
            >
              <p className="font-medium">{m.fullName}</p>
              <p className="text-sm text-gray-400">{m.role}</p>
              <p className="text-sm">{m.idType} - {m.idNumber}</p>
              <p className="text-sm">{m.address}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Documents</h3>

        <div className="space-y-2">
          {kyc.documents.map((doc: any) => (
            <p key={doc.id}>
              {doc.type} → {doc.filePath}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}