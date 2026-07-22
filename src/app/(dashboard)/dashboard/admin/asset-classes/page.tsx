"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import InProgress from "@/components/InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import PopUp from "@/components/PopUp";
import AssetClassForm from "@/components/AssetClassForm";
import { AssetClassFormValues } from "@/components/AssetClassForm";

type AssetClass = {
  id: string;
  name: string;
  acronym: string | null;
  headline: string | null;
  fundType: string | null;
  riskProfile: string | null;
  minimumInvestment: number;
  isPublished: boolean;
  isActive: boolean;
};

export default function AssetList() {
  const [assets, setAssets] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetClassFormValues | null>(null);
  const [assetToDelete, setAssetToDelete] =
  useState<AssetClass | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function handleDelete(id: string) {

    try {

      const res = await fetchWithAuth(
        `/api/admin/asset-classes/${id}`,
        {
          method: "DELETE"
        }
      );


      const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error);
      }


      await fetchAssets();


    } catch (err: any) {

      console.error(err);

    }

  }



  async function fetchAssets() {
    try {

      const res = await fetchWithAuth("/api/admin/asset-classes");

      console.log("Response status:", res.status);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(id: string) {

    console.log("Fetching asset class with ID:", id);
    try {
      const res = await fetchWithAuth(`/api/admin/asset-classes/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      console.log("Fetched asset class data:", data);
      setSelectedAsset(data);

      setTimeout(() => {
        document
          .getElementById("asset-class-form")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }); 
      }, 100);
    } catch (err) {
      console.error(err);
    }

    if (loading) {
      return (
        <InProgress message="Loading asset classes" />
      );
    }
  }

  return (
    <section className="">
      <div className="mb-8 flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold text-my-deep-blue">
            Asset Classes
          </h2>

          <p className="mt-1 text-sm text-my-gray">
            Manage your investment asset classes.
          </p>
        </div>

      </div>

      <div className="space-y-4 px-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl border border-my-gray/10 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-my-deep-blue">
                    {asset.name}
                  </h3>

                  {asset.acronym && (
                    <span className="rounded bg-my-blue/10 px-2 py-1 text-xs font-semibold text-my-blue">
                      {asset.acronym}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-my-gray">
                  {asset.headline}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(asset.id)}
                  className="rounded-lg p-2 hover:bg-my-blue/10 cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setAssetToDelete(asset)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-my-gray">Fund Type</p>
                <p className="font-medium">{asset.fundType}</p>
              </div>

              <div>
                <p className="text-xs text-my-gray">Risk</p>
                <p className="font-medium">{asset.riskProfile}</p>
              </div>

              <div>
                <p className="text-xs text-my-gray">Minimum</p>
                <p className="font-medium">
                  ${asset.minimumInvestment.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-my-gray">Status</p>

                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${asset.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {asset.isPublished ? "Published" : "Draft"}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${asset.isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {asset.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!assets.length && (
          <div className="rounded-xl border border-dashed border-my-gray/20 p-12 text-center">
            <h3 className="text-lg font-semibold text-my-deep-blue">
              No asset classes yet
            </h3>

            <p className="mt-2 text-my-gray">
              Create your first asset class to get started.
            </p>
          </div>
        )}
      </div>
      <AssetClassForm asset={selectedAsset} refreshAssets={() => fetchAssets()} />
      {assetToDelete && (

        <PopUp

          title="Delete Asset Class"

          message={
            `Are you sure you want to delete "${assetToDelete.name}"?`
          }

          onConfirm={() => {
            console.log("Deleting asset class with ID:", assetToDelete.id);
            if (assetToDelete.id) {
              handleDelete(assetToDelete.id);
            }
            setAssetToDelete(null);
          }}

          onClose={() => setAssetToDelete(null)}

        />

      )}
    </section>
  );
}