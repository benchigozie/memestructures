"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import ErrorResponse from "@/components/ErrorResponse";
import SuccessResponse from "@/components/SuccessResponse";
import PopUp from "@/components/PopUp";
import { funds } from "@/data/funds";

type InvestmentFormValues = {
    amount: string;
    assetClass: string;
};

const getSchema = (walletBalance: number) =>
    Yup.object({
        assetClass: Yup.string()
            .required("Asset class is required")
            .oneOf(funds.map((f) => f.slug), "Invalid asset class selected"),

        amount: Yup.number()
            .typeError("Enter a valid amount")
            .required("Amount is required")
            .test("min-max-check", function (value) {
                const { assetClass } = this.parent;

                const selectedFund = funds.find((f) => f.slug === assetClass);

                if (!selectedFund || value == null) return false;

                const fee = value * 0.01;
                const total = value + fee;

                if (total > walletBalance) {
                    return this.createError({
                        message: "Insufficient wallet balance",
                    });
                }

                if (value < selectedFund.minInvestment) {
                    return this.createError({
                        message: `Minimum investment is $${selectedFund.minInvestment.toLocaleString()}`,
                    });
                }

                if (
                    selectedFund.maxInvestment &&
                    value > selectedFund.maxInvestment
                ) {
                    return this.createError({
                        message: `Maximum investment is $${selectedFund.maxInvestment.toLocaleString()}`,
                    });
                }

                return true;
            }),
    });
const AssetInvestment = () => {
    const [formState, setFormState] = useState<
        "idle" | "submitting" | "error" | "success"
    >("idle");

    const [responseMessage, setResponseMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [pendingValues, setPendingValues] =
        useState<InvestmentFormValues | null>(null);

    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [loadingWallet, setLoadingWallet] = useState(true);

    const fetchWallet = async () => {
        try {
            setLoadingWallet(true);

            const res = await fetchWithAuth("/api/user/wallet");

            const data = await res.json();

            console.log("Wallet fetch response:", data);

            if (data.success) {
                setWalletBalance(data.wallet.balance);
            }
        } catch (err) {
            console.error("Wallet fetch failed:", err);
        } finally {
            setLoadingWallet(false);
        }
    };

    useEffect(() => {
        
        fetchWallet();
    }, []);

    const submitInvestment = async (values: InvestmentFormValues) => {
        const selectedFund = funds.find((f) => f.slug === values.assetClass);

        if (!selectedFund) return;

        setFormState("submitting");

        try {
            const res = await fetchWithAuth("/api/investment/wallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: Number(values.amount),
                    assetClass: values.assetClass,
                    method: "WALLET",
                    fundName: selectedFund.slug.toUpperCase(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                setFormState("success");
                fetchWallet();
                setResponseMessage(
                    data.message || "Investment submitted successfully!"
                );
            } else {
                setFormState("error");
                setResponseMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setFormState("error");
            setResponseMessage("Unexpected error occurred");
        }
    };

    const handleConfirm = () => {
        if (pendingValues) {
            submitInvestment(pendingValues);
        }
        setShowPopup(false);
    };

    const handleClose = () => {
        setShowPopup(false);
        setPendingValues(null);
    };

    return (
        <div className="p-4 md:p-10">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100 max-w-xl">

                <section className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl text-center md:text-3xl text-my-deep-blue font-bold">
                        Fund An Asset Class
                    </h1>

                    <p className="text-gray-600 text-[17px] text-center">
                        wallet balance:{" "}
                        <span className="font-medium text-my-deep-blue">
                            {loadingWallet
                                ? "Loading..."
                                : `$${walletBalance.toLocaleString()}`}
                        </span>
                    </p>
                </section>

                <section className="mt-4">

                    {formState === "idle" && (
                        <Formik<InvestmentFormValues>
                            enableReinitialize
                            initialValues={{
                                amount: "",
                                assetClass: "",
                            }}
                            validationSchema={
                                loadingWallet ? undefined : getSchema(walletBalance)
                            }
                            onSubmit={(values) => {
                                setPendingValues(values);
                                setShowPopup(true);
                            }}
                        >
                            {({ isValid, dirty, values }) => {
                                const amount = Number(values.amount) || 0;
                                const fee = amount * 0.01;
                                const total = amount + fee;
                                const insufficientBalance = total > walletBalance;

                                const selectedFund = funds.find(
                                    (f) => f.slug === values.assetClass
                                );

                                return (
                                    <Form className="mt-4">

                                        <div className="flex flex-col">
                                            <label className="text-sm text-my-deep-blue font-medium">
                                                Choose Asset Class
                                            </label>

                                            <Field
                                                as="select"
                                                name="assetClass"
                                                className="w-full outline outline-my-gray/40 focus:outline-my-deep-blue rounded-lg px-4 py-3 mt-2"
                                            >
                                                <option value="">Select asset class</option>

                                                {funds.map((f) => (
                                                    <option key={f.slug} value={f.slug}>
                                                        {f.name}
                                                    </option>
                                                ))}
                                            </Field>

                                            <ErrorMessage
                                                name="assetClass"
                                                component="p"
                                                className="text-red-500 text-sm mt-2"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="text-sm text-my-deep-blue font-medium">
                                                Investment Amount (USD)
                                            </label>

                                            <Field
                                                name="amount"
                                                type="number"
                                                className="w-full max-w-sm outline outline-my-gray/40 focus:outline-my-deep-blue rounded-lg px-4 py-3 mt-2"
                                            />

                                            <ErrorMessage
                                                name="amount"
                                                component="p"
                                                className="text-red-500 text-sm mt-2"
                                            />
                                        </div>

                                        {amount > 0 && selectedFund && (
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

                                        {amount > 0 && insufficientBalance && (
                                            <p className="text-red-500 bg-red-100 mt-2 p-6 rounded-lg">
                                                Insufficient wallet balance
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={!isValid || !dirty || insufficientBalance}
                                            className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg disabled:opacity-50 duration-300 transition-colors cursor-pointer"
                                        >
                                            Fund Asset Class
                                        </button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    )}

                    {formState === "submitting" && (
                        <InProgress message="Funding Asset Class, please wait" />
                    )}

                    {formState === "error" && (
                        <div>
                            <ErrorResponse message={responseMessage} />
                            <button
                                onClick={() => setFormState("idle")}
                                className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg"
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
                                className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {showPopup && pendingValues && (
                <PopUp
                    title="Confirm Investment"
                    message={`Invest $${Number(
                        pendingValues.amount
                    ).toLocaleString()} into ${funds.find((f) => f.slug === pendingValues.assetClass)?.name
                        }?`}
                    onConfirm={handleConfirm}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default AssetInvestment;