"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import { XCircle, CircleCheckBig, ArrowLeft } from "lucide-react";
import { PuffLoader } from "react-spinners";

const schema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
});

const Page = () => {
    const [formState, setFormState] = useState<"idle" | "submitting" | "error" | "success">("idle");
    const [responseMessage, setResponseMessage] = useState("");

    return (
        <section className="py-14 bg-my-white w-full min-h-screen flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-4 w-full flex flex-col items-center">
                <div className="bg-white border border-my-gray/10 rounded-3xl w-full max-w-xl p-8 md:p-12 mx-auto shadow-2xl shadow-my-deep-blue/5 transition-all duration-300">
                    
                    {/* Header Logo & Title */}
                    <div className="flex flex-col items-center text-center gap-3 mb-8">
                        <Link href="/" className="hover:opacity-90 transition-opacity">
                            <Image
                                src="/images/memestructureslogo.png"
                                alt="Meme Structures Logo"
                                width={220}
                                height={60}
                                priority
                            />
                        </Link>
                        <div className="mt-2 space-y-1">
                            <h2 className="text-3xl md:text-4xl text-my-deep-blue font-bold tracking-tight">
                                Reset Password
                            </h2>
                            <p className="text-my-gray/80 text-sm md:text-base max-w-sm">
                                Enter your registered email address and we&apos;ll send you a password reset link.
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Error State */}
                        {formState === "error" && (
                            <div className="flex flex-col items-center text-center p-6 bg-red-50/50 rounded-2xl border border-red-100">
                                <XCircle size={52} color="#EF4444" className="mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
                                <p className="text-sm text-gray-600 max-w-xs">{responseMessage}</p>
                                <Link 
                                    href="/login"
                                    className="mt-6 w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 px-4 font-semibold hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-center"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        )}

                        {/* Success State */}
                        {formState === "success" && (
                            <div className="flex flex-col items-center text-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <CircleCheckBig size={52} color="#006de2" className="mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Check your inbox</h3>
                                <p className="text-sm text-gray-600 max-w-xs">{responseMessage}</p>
                                <Link 
                                    href="/login"
                                    className="mt-6 w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 px-4 font-semibold hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-center"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        )}

                        {/* Submitting State */}
                        {formState === "submitting" && (
                            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                                <PuffLoader color="#006de2" size={60} />
                                <p className="text-my-gray text-base font-medium animate-pulse">
                                    Sending reset link, please wait...
                                </p>
                            </div>
                        )}

                        {/* Idle / Form State */}
                        {formState === "idle" && (
                            <Formik
                                initialValues={{ email: "" }}
                                validationSchema={schema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    setFormState("submitting");

                                    try {
                                        const response = await fetch("/api/auth/forgot-password", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(values),
                                        });

                                        const result = await response.json();
                                        console.log(result);

                                        if (result.success) {
                                            setFormState("success");
                                            setResponseMessage(result.message || "Reset link sent successfully!");
                                        } else {
                                            setFormState("error");
                                            setResponseMessage(result.error || "Failed to send reset link. Please try again.");
                                        }
                                    } catch (err) {
                                        setFormState("error");
                                        setResponseMessage("An unexpected error occurred. Please try again later.");
                                        console.error(err);
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-5">
                                        <div>
                                            <label 
                                                htmlFor="email" 
                                                className="block text-my-gray font-medium text-sm mb-1.5"
                                            >
                                                Email Address
                                            </label>
                                            <Field
                                                name="email"
                                                type="email"
                                                id="email"
                                                placeholder="john@example.com"
                                                autoComplete="email"
                                                className="w-full rounded-xl border border-gray-200 focus:border-my-blue focus:ring-2 focus:ring-my-blue/20 outline-none px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 shadow-sm"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="p"
                                                className="text-xs font-medium text-red-500 mt-1.5 ml-1"
                                            />
                                        </div>

                                        <button
                                            className="w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Send Reset Link
                                        </button>

                                        <div className="text-center pt-2">
                                            <Link 
                                                href="/login"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-my-gray hover:text-my-blue transition-colors"
                                            >
                                                <ArrowLeft size={16} />
                                                Back to Login
                                            </Link>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;