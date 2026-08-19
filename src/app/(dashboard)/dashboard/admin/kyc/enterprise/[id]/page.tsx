"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import { RenderFile } from "@/components/RenderFile";
import { ArrowLeft } from "lucide-react";
import PopUp from "@/components/PopUp";

export default function EnterpriseKycPage() {
  const { id } = useParams();
  const router = useRouter();

  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [pendingStatus, setPendingStatus] = useState<"VERIFIED" | "REJECTED" | null>(null);

  const updateStatus = async (status: "VERIFIED" | "REJECTED") => {
    try {
      const res = await fetchWithAuth(
        `/api/admin/kyc/enterprise/${id}/status`,
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
          status,
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
          `/api/admin/kyc/enterprise/${id}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.success) {
          setKyc(data.data);
          console.log("Fetched KYC data:", data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchKyc();
  }, [id]);

  if (loading) return <InProgress message="Loading Enterprise KYC" />;
  if (!kyc) return <p className="p-4">KYC not found</p>;

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div className="flex justify-between items-start">
        <button
          onClick={() => router.back()}
className="hidden md:flex gap-1 items-center cursor-pointer text-my-blue rounded-md hover:text-my-deep-blue transition-all duration-300 mb-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <span className="text-xs px-4 py-2 rounded bg-gray-800 text-white">
          {kyc.status}
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-my-deep-blue">Company</h1>
      </div>

      <div>
        <div className="flex gap-1 items-center">
          <h2 className="font-medium">Company Name: </h2>
          <p>{kyc.companyName}</p>
        </div>
        <h2 className="font-medium">Documents:</h2>
        <div className="space-y-4 mt-4">
          {kyc.documents.map((doc: any) => (
            <RenderFile
              key={doc.id}
              url={doc.url}
              label={doc.type}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-my-deep-blue">Members</h2>

        <div className="space-y-6 mt-4">
          {kyc.members.map((member: any) => (
            <div key={member.id} className="outline outline-my-gray/10 p-4 rounded-lg space-y-2">

              <p><span className="font-medium">Role:</span> {member.role}</p>
              <p><span className="font-medium">Name:</span> {member.fullName}</p>
              <p><span className="font-medium">ID Type:</span> {member.idType}</p>
              <p><span className="font-medium">ID Number:</span> {member.idNumber}</p>
              <p><span className="font-medium">Address:</span> {member.address}</p>

              <div className="space-y-2">
                <RenderFile url={member.idBackUrl} label="ID Front" />
                <RenderFile url={member.idFrontUrl} label="ID Back" />
                {member.proofOfAddressPath && (
                  <RenderFile
                    url={member.proofOfAddressUrl}
                    label="Proof of Address"
                  />
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
                    <button
                         onClick={() => {
                            setPendingStatus("VERIFIED");
                            setPopUpMessage("Are you sure you want to verify this KYC?");
                            setShowPopUp(true);
                        }}
                        className="px-4 py-2 bg-green-400 text-white rounded-xl hover:bg-green-600 cursor-pointer"
                    >
                        Verify
                    </button>

                    <button
                        onClick={() => {
                            setPendingStatus("REJECTED");
                            setPopUpMessage("Are you sure you want to reject this KYC?");
                            setShowPopUp(true);
                        }}
                        className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-600 cursor-pointer"
                    >
                        Reject
                    </button>
                </div>
      {
                showPopUp && (
                    <PopUp
                        title="Confirm Action"
                        message={popUpMessage}
                        onConfirm={() => {
                            console.log("Confirmed action with status:", pendingStatus);
                            if (pendingStatus) {
                                updateStatus(pendingStatus);
                            }
                            setShowPopUp(false);
                            setPendingStatus(null);
                        }}
                        onClose={() => setShowPopUp(false)}
                    />
                )
            }
    </div>
  );
}