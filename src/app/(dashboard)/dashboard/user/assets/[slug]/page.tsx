"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import AssetInvestment from "@/components/AssetInvestment";

import * as Yup from "yup";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";

const getSchema = (asset: any) =>
  Yup.object({
    amount: Yup.number()
      .typeError("Enter a valid amount")
      .required("Amount is required")
      .min(
        asset.minimumInvestment,
        `Minimum investment is ₦${asset.minimumInvestment.toLocaleString()}`
      )
      .test(
        "max-check",
        `Maximum investment is ₦${asset.maximumInvestment?.toLocaleString()}`,
        (value) => {
          if (!value) return false;

          if (!asset.maximumInvestment) {
            return true;
          }

          return value <= asset.maximumInvestment;
        }
      ),
  });

const Page = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = use(params);

  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        console.log("Fetching asset:", slug);

        const res = await fetchWithAuth(
          `/api/asset-classes/${slug}`
        );

        if (!res.ok) {
          notFound();
        }

        const data = await res.json();
        setAsset(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [slug]);

  if (loading) {
    return <InProgress message="Loading asset class" />;
  }

  if (!asset) {
    return null;
  }

  return (
    <AssetInvestment asset={asset} validationSchema={getSchema(asset)} />
  );
};

export default Page;