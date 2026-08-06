"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { fetchWithAuth } from "@/utils/fetchWithAuth";

type FormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const validationSchema = Yup.object({

    currentPassword: Yup.string()
        .required("Current password is required."),

    newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref("newPassword")],
            "Passwords do not match."
        )
        .required("Please confirm your new password."),
});

export default function ChangePassword() {

    const [showCurrent, setShowCurrent] = useState(false);

    const [showNew, setShowNew] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const [success, setSuccess] = useState("");

    const [serverError, setServerError] = useState("");

    async function handleSubmit(
        values: FormValues,
        helpers: FormikHelpers<FormValues>
    ) {

        setSuccess("");
        setServerError("");

        try {

            const response = await fetchWithAuth(
                "/api/settings/password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({

                        currentPassword: values.currentPassword,

                        newPassword: values.newPassword,

                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {

                setServerError(
                    result.error || "Unable to update password."
                );

                return;
            }

            setSuccess(
                result.message || "Password updated successfully."
            );

            helpers.resetForm();

        } catch (error) {

            console.error(error);

            setServerError(
                "Something went wrong. Please try again."
            );

        } finally {

            helpers.setSubmitting(false);

        }

    }

    return (

        <div>

            <p
                className="
                    mt-1
                    text-my-gray
                    mb-8
                "
            >
                Change your password to keep your account secure.
            </p>

            <Formik<FormValues>

                initialValues={{

                    currentPassword: "",

                    newPassword: "",

                    confirmPassword: "",

                }}

                validationSchema={validationSchema}

                onSubmit={handleSubmit}

            >

                {({

                    isSubmitting,

                }) => (

                    <Form
                        className="
                            space-y-6
                        "
                    >

                        {/* Current Password */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-my-deep-blue
                                    mb-2
                                "
                            >
                                Current Password
                            </label>

                            <div className="relative">

                                <Field
                                    name="currentPassword"
                                    type={
                                        showCurrent
                                            ? "text"
                                            : "password"
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-my-gray/30
                                        px-4
                                        py-3
                                        pr-12
                                        outline-none
                                        focus:border-my-blue
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(
                                            !showCurrent
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-my-gray
                                    "
                                >

                                    {
                                        showCurrent
                                            ? <EyeOff size={18} />
                                            : <Eye size={18} />
                                    }

                                </button>

                            </div>

                            <ErrorMessage
                                name="currentPassword"
                                component="p"
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            />

                        </div>

                        {/* New Password */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-my-deep-blue
                                    mb-2
                                "
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <Field
                                    name="newPassword"
                                    type={
                                        showNew
                                            ? "text"
                                            : "password"
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-my-gray/30
                                        px-4
                                        py-3
                                        pr-12
                                        outline-none
                                        focus:border-my-blue
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNew(
                                            !showNew
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-my-gray
                                    "
                                >

                                    {
                                        showNew
                                            ? <EyeOff size={18} />
                                            : <Eye size={18} />
                                    }

                                </button>

                            </div>

                            <ErrorMessage
                                name="newPassword"
                                component="p"
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            />

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-my-deep-blue
                                    mb-2
                                "
                            >
                                Confirm New Password
                            </label>

                            <div className="relative">

                                <Field
                                    name="confirmPassword"
                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-my-gray/30
                                        px-4
                                        py-3
                                        pr-12
                                        outline-none
                                        focus:border-my-blue
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(
                                            !showConfirm
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-my-gray
                                    "
                                >

                                    {
                                        showConfirm
                                            ? <EyeOff size={18} />
                                            : <Eye size={18} />
                                    }

                                </button>

                            </div>

                            <ErrorMessage
                                name="confirmPassword"
                                component="p"
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            />

                        </div>

                        <div
                            className="
                                rounded-lg
                                bg-my-light-blue/20
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-my-gray
                                "
                            >
                                Password requirements:
                            </p>

                            <ul
                                className="
                                    mt-2
                                    list-disc
                                    list-inside
                                    text-sm
                                    text-my-gray
                                    space-y-1
                                "
                            >
                                <li>
                                    At least 8 characters.
                                </li>
                            </ul>

                            <ul
                                className="
                                    mt-2
                                    list-disc
                                    list-inside
                                    text-sm
                                    text-my-gray
                                    space-y-1
                                "
                            >
                                <li>
                                    Must contain a lowercase letter.
                                </li>
                            </ul>
                            <ul
                                className="
                                    mt-2
                                    list-disc
                                    list-inside
                                    text-sm
                                    text-my-gray
                                    space-y-1
                                "
                            >
                                <li>
                                    Must contain an uppercase letter.
                                </li>
                            </ul>
                            <ul
                                className="
                                    mt-2
                                    list-disc
                                    list-inside
                                    text-sm
                                    text-my-gray
                                    space-y-1
                                "
                            >
                                <li>
                                    Must contain a number.
                                </li>
                            </ul>


                        </div>

                        {

                            serverError && (

                                <div
                                    className="
                                        rounded-lg
                                        bg-red-50
                                        border
                                        border-red-200
                                        px-4
                                        py-3
                                        text-red-600
                                        text-sm
                                    "
                                >
                                    {serverError}
                                </div>

                            )

                        }

                        {

                            success && (

                                <div
                                    className="
                                        rounded-lg
                                        bg-green-50
                                        border
                                        border-green-200
                                        px-4
                                        py-3
                                        text-green-600
                                        text-sm
                                    "
                                >
                                    {success}
                                </div>

                            )

                        }

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-my-blue
                                px-6
                                py-3
                                text-white
                                font-medium
                                hover:opacity-90
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {

                                isSubmitting && (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                )

                            }

                            {

                                isSubmitting
                                    ? "Updating..."
                                    : "Update Password"

                            }

                        </button>

                    </Form>

                )}

            </Formik>

        </div>

    );

}