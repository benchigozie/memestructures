"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useState } from "react";

type WalletTransaction = {
    id: string;
    type: string;
    amount: number;
};

type Props = {
    user: {
        id: string;
        wallet: {
            id: string;
            balance: number;
            transactions?: WalletTransaction[];
        } | null;
    };
    refreshUser: () => void;
};

const validationSchema = Yup.object({
    amount: Yup.number()
        .typeError("Amount is required")
        .positive("Amount must be greater than zero")
        .required("Amount is required"),

    type: Yup.string()
        .oneOf(["ADMIN_CREDIT", "ADMIN_DEBIT"])
        .required(),

});

export default function UserWallet({
    user,
    refreshUser,
}: Props) {

    const [loading, setLoading] = useState(false);

    async function updateWallet(
        values: any,
        resetForm: () => void
    ) {
        setLoading(true);

        try {
            const res = await fetchWithAuth(
                `/api/admin/users/${user.id}/wallet`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || "Unable to update wallet"
                );
            }

            refreshUser();
            resetForm();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <div className="flex justify-between items-start mb-8">

                <div>

                    <h2 className="text-xl font-bold text-my-deep-blue">
                        Wallet
                    </h2>

                    <p className="text-my-gray mt-1">
                        Manage this client's wallet balance.
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-sm text-my-gray">
                        Current Balance
                    </p>

                    <h3 className="text-3xl font-bold text-my-deep-blue">

                        $
                        {(
                            user.wallet?.balance ?? 0
                        ).toLocaleString()}

                    </h3>

                </div>

            </div>



            <Formik

                initialValues={{
                    amount: "",
                    type: "ADMIN_CREDIT",
                }}

                validationSchema={validationSchema}

                onSubmit={(values, { resetForm }) =>
                    updateWallet(values, resetForm)
                }

            >

                {({ isSubmitting }) => (

                    <Form className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="block text-sm mb-2">
                                Amount
                            </label>

                            <Field
                                name="amount"
                                type="number"
                                placeholder="500000"
                                className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                            />

                            <ErrorMessage
                                name="amount"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />

                        </div>



                        <div>

                            <label className="block text-sm mb-2">
                                Adjustment
                            </label>

                            <Field
                                as="select"
                                name="type"
                                className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                            >

                                <option value="ADMIN_CREDIT">
                                    Credit Wallet
                                </option>

                                <option value="ADMIN_DEBIT">
                                    Debit Wallet
                                </option>

                            </Field>

                        </div>



                        <div className="flex justify-start">

                            <button
                                type="submit"
                                disabled={loading || isSubmitting}
                                className="rounded-lg outline-my-deep-blue outline text-my-deep-blue px-6 py-3 hover:text-white hover:bg-my-deep-blue transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Wallet"}

                            </button>

                        </div>

                    </Form>

                )}

            </Formik>

        </section>

    );

}