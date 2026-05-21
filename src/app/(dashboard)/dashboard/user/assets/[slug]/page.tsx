"use client";

import { funds } from "@/data/funds";
import { notFound } from "next/navigation";

import * as Yup from "yup";

import AssetInvestment from "@/components/AssetInvestment";

const getSchema = (fund: any) =>
    Yup.object({
        amount: Yup.number()
            .typeError("Enter a valid amount")
            .required("Amount is required")
            .min(
                fund.minInvestment,
                `Minimum investment is $${fund.minInvestment.toLocaleString()}`
            )
            .test(
                "max-check",
                `Maximum investment is $${fund.maxInvestment?.toLocaleString()}`,
                (value) => {
                    if (!value) return false;
                    if (!fund.maxInvestment) return true;
                    return value <= fund.maxInvestment;
                }
            ),
    });

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const fund = funds.find((f) => f.slug === slug);

    if (!fund) return notFound();

    return <AssetInvestment fund={fund} />;
};

export default page;