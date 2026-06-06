"use client";

import { notFound } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { wallets } from "@/data/wallets";
import { useRef, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "./InProgress";
import ErrorResponse from "./ErrorResponse";
import SuccessResponse from "./SuccessResponse";


import * as Yup from "yup";

type InvestmentFormValues = {
    amount: string;
    coin: string;
    network: string;
    proof: File | null;
};



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
        coin: Yup.string().required("Select a coin"),
        network: Yup.string().required("Select a network"),

        proof: Yup.mixed().required("Proof of payment is required"),
    });

const AssetInvestment = ({ fund }: { fund: any }) => {

    async function submitInvestment(values: InvestmentFormValues, fund: any) {
        setFormState("submitting");

        const formData = new FormData();

        formData.append("amount", values.amount);
        formData.append("coin", values.coin);
        formData.append("network", values.network);
        formData.append("fundName", fund.slug.toUpperCase());

        if (values.proof) {
            formData.append("proof", values.proof);
        }

        console.log("Submitting form with values: ", formData);

        try {
            const res = await fetchWithAuth("/api/investment/direct", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setFormState("success");
                setResponseMessage(data.message || "Investment submitted successfully!");
            } else {
                setFormState("error");
                setResponseMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setFormState("error");
            setResponseMessage("Unexpected error occurred");
        }
    }

    const [formState, setFormState] = useState<"idle" | "submitting" | "error" | "success">("idle");
    const [responseMessage, setResponseMessage] = useState("");

    const proofRef = useRef<HTMLInputElement>(null);

    if (!fund) return notFound();

    return (
        <div className="p-4 md:p-10">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100 max-w-xl">

                <section className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl text-center md:text-3xl text-my-deep-blue font-bold mb-1">
                        Invest in {fund.name}
                    </h1>

                    <p className="text-gray-600 text-[17px]">
                        {fund.description}
                    </p>
                </section>

                <section className="">

                    <h2 className="text-xl font-semibold text-my-deep-blue mb-4">
                        Fund Overview
                    </h2>
                    {formState === "idle" &&
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs">MIN INVESTMENT</span>
                                <p className="font-medium text-my-deep-blue">
                                    ${fund.minInvestment.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs">MAX INVESTMENT</span>
                                <p className="font-medium text-my-deep-blue">
                                    {fund.maxInvestment
                                        ? `$${fund.maxInvestment.toLocaleString()}`
                                        : "Unlimited"}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs">LOCK-UP PERIOD</span>
                                <p className="font-medium text-my-deep-blue">
                                    {fund.lockup}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs">TARGET RETURN</span>
                                <p className="font-medium text-my-deep-blue">
                                    {fund.targetReturn}
                                </p>
                            </div>
                        </div>
                    }
                </section>
                <section className="mt-4">
                    {formState === "idle" && (
                        <Formik<InvestmentFormValues>
                            initialValues={{
                                amount: "",
                                coin: "",
                                network: "",
                                proof: null
                            }}
                            validationSchema={getSchema(fund)}
                            onSubmit={(values) => submitInvestment(values, fund)}
                        >
                            {({ isValid, dirty, values, setFieldValue }) => {

                                const amount = Number(values.amount) || 0;
                                const fee = amount * 0.01;
                                const total = amount + fee;

                                const selectedWallet = wallets.find(
                                    (w) => w.coin === values.coin
                                );
                                const selectedNetwork = selectedWallet?.networks.find(
                                    (n) => n.name === values.network
                                );


                                return (
                                    <Form className="mt-4">

                                        <div>
                                            <label className="text-sm text-my-deep-blue font-medium">
                                                Investment Amount (USD)
                                            </label>

                                            <Field
                                                name="amount"
                                                type="number"
                                                className="w-full outline outline-my-gray/40 focus:outline-my-deep-blue rounded-lg px-4 py-3 mt-2"
                                                placeholder={`Min $${fund.minInvestment.toLocaleString()}`}
                                            />

                                            <ErrorMessage
                                                name="amount"
                                                component="p"
                                                className="text-red-500 text-sm mt-2"
                                            />
                                        </div>

                                        {amount > 0 && (
                                            <div className="mt-4 text-sm">
                                                <p>
                                                    1% subscription fee:{" "}
                                                    <span className="font-medium text-my-deep-blue">
                                                        ${fee.toLocaleString()}
                                                    </span>
                                                </p>

                                                <p>
                                                    Total to pay:{" "}
                                                    <span className="font-medium text-my-deep-blue">
                                                        ${total.toLocaleString()}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">


                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-my-deep-blue">
                                                    Select Coin
                                                </label>

                                                <Field
                                                    as="select"
                                                    name="coin"
                                                    className="w-full max-w-sm mt-2 px-4 py-3 rounded-lg border border-my-gray/40 focus:border-my-deep-blue outline-none"
                                                >
                                                    <option value="">Select coin</option>

                                                    {wallets.map((w) => (
                                                        <option key={w.coin} value={w.coin}>
                                                            {w.coin}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-my-deep-blue">
                                                    Select Network
                                                </label>

                                                <Field
                                                    as="select"
                                                    name="network"
                                                    disabled={!values.coin}
                                                    className="w-full mt-2 px-4 max-w-sm py-3 rounded-lg border border-my-gray/40 focus:border-my-deep-blue outline-none"
                                                >
                                                    <option value="">Select network</option>

                                                    {selectedWallet?.networks.map((n) => (
                                                        <option key={n.name} value={n.name}>
                                                            {n.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        </div>

                                        {selectedNetwork && (
                                            <div className="mt-4 p-3 rounded-lg bg-gray-50 outline outline-my-gray/60">
                                                <p className="text-sm text-gray-500">Wallet Address</p>
                                                <p className="font-mono text-sm break-all text-my-deep-blue">
                                                    {selectedNetwork.address}
                                                </p>
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <label className="text-my-deep-blue text-[15px]">
                                                Upload Payment Proof
                                            </label>
                                            <input
                                                ref={proofRef}
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) => {
                                                    const file = e.currentTarget.files?.[0];
                                                    if (file) setFieldValue("proof", file);
                                                }}
                                                className="hidden"
                                            />

                                            <div
                                                onClick={() => proofRef.current?.click()}
                                                className="mt-2 cursor-pointer border-2 border-dashed border-my-gray/40 hover:border-my-deep-blue rounded-xl p-8 text-center"
                                            >
                                                <Image
                                                    src="/images/upload.png"
                                                    alt="ID Front Icon"
                                                    width={40}
                                                    height={40}
                                                    className="mx-auto mb-2"
                                                />
                                                {values.proof ? (
                                                    <p className="font-medium text-my-deep-blue">
                                                        ✓ {values.proof.name}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        Click to upload proof (PNG, JPG, PDF)
                                                    </p>
                                                )}
                                            </div>

                                            <ErrorMessage
                                                name="proof"
                                                component="p"
                                                className="text-red-500 text-sm mt-2"
                                            />

                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!isValid || !dirty}
                                            className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg disabled:opacity-50 duration-300 transition-colors cursor-pointer"
                                        >
                                            Submit Investment
                                        </button>
                                    </Form>
                                )
                            }}
                        </Formik>
                    )}

                    {formState === "submitting" && (
                        <InProgress message="Submitting your investment, please wait" />
                    )}

                    {formState === "error" && (
                        <div>
                            <ErrorResponse message={responseMessage} />
                            <button
                                onClick={() => setFormState("idle")}
                                className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg disabled:opacity-50 duration-300 transition-colors cursor-pointer"
                            >
                                Back to Investment Page
                            </button>
                        </div>

                    )}

                    {formState === "success" && (
                        <div>
                            <SuccessResponse message={responseMessage} />
                            <button
                                onClick={() => setFormState("idle")}
                               className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg disabled:opacity-50 duration-300 transition-colors cursor-pointer"
                            >
                                Back to Investment Page
                            </button>
                        </div>

                    )}

                </section>
            </div>
        </div>
    );


}

export default AssetInvestment;