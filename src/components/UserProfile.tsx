"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { fetchWithAuth } from "@/utils/fetchWithAuth";

type Props = {
    user: any;
    refreshUser: () => void;
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),

    accountType: Yup.string().required(),

    kycStatus: Yup.string().required(),

    accountStatus: Yup.string().required(),
});

export default function UserProfile({
    user,
    refreshUser,
}: Props) {
    async function updateProfile(values: any) {
        const res = await fetchWithAuth(
            `/api/admin/users/${user.id}`,
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
            throw new Error(data.error);
        }

        refreshUser();
    }

    return (
        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold text-my-deep-blue">
                    Profile
                </h2>

                <p className="text-sm text-my-gray">
                    Edit client information
                </p>

            </div>

            <Formik
                initialValues={{
                    name: user.name,
                    accountType: user.accountType,
                    kycStatus: user.kycStatus,
                    accountStatus: user.accountStatus,
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={updateProfile}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm mb-2">
                                    Full Name
                                </label>

                                <Field
                                    name="name"
                                    className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                                />

                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>


                            <div>
                                <label className="block text-sm mb-2">
                                    Account Type
                                </label>

                                <Field
                                    as="select"
                                    name="accountType"
                                    className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                                >
                                    <option value="INDIVIDUAL">
                                        Individual
                                    </option>

                                    <option value="ENTERPRISE">
                                        Enterprise
                                    </option>
                                </Field>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">
                                    KYC Status
                                </label>

                                <Field
                                    as="select"
                                    name="kycStatus"
                                    className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                                >
                                    <option value="UNVERIFIED">
                                        Unverified
                                    </option>

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="VERIFIED">
                                        Verified
                                    </option>

                                    <option value="REJECTED">
                                        Rejected
                                    </option>

                                    <option value="UNCOMPLETED">
                                        Uncompleted
                                    </option>
                                </Field>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">
                                    Account Status
                                </label>

                                <Field
                                    as="select"
                                    name="accountStatus"
                                    className="w-full rounded-lg p-3 outline outline-my-gray/20 focus:outline-my-deep-blue"
                                >
                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="SUSPENDED">
                                        Suspended
                                    </option>

                                    <option value="BANNED">
                                        Banned
                                    </option>
                                </Field>
                            </div>

                        </div>

                        <div className="flex justify-end pt-4">

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-my-blue px-6 py-3 text-white hover:bg-my-deep-blue disabled:opacity-50 transition-colors duration-300 cursor-pointer"
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </Form>
                )}
            </Formik>

        </section>
    );
}