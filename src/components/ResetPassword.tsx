"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import { Eye, EyeClosed, XCircle, CircleCheckBig, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import InProgress from './InProgress';

const schema = Yup.object({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain a lowercase letter")
        .matches(/[A-Z]/, "Must contain an uppercase letter")
        .matches(/[0-9]/, "Must contain a number")
        .required("Password is required"),
});

const Page = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const params = useSearchParams();
    const token = params.get("token");
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const toggleVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
                                Choose a New Password
                            </h2>
                            <p className="text-my-gray/80 text-sm md:text-base max-w-sm">
                                Please enter a strong password containing at least 8 characters, an uppercase letter, a lowercase letter, and a number.
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Idle / Form State */}
                        {formState === "idle" && (
                            <Formik
                                initialValues={{ password: "" }}
                                validationSchema={schema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    if (!token) {
                                        setFormState("error");
                                        setMessage("No token provided.");
                                        return;
                                    }

                                    setFormState("submitting");

                                    try {
                                        const res = await fetch("/api/auth/reset-password", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ token, newPassword: values.password }),
                                        });

                                        const result = await res.json();
                                        console.log(result);

                                        if (result.success) {
                                            setFormState("success");
                                        } else {
                                            setMessage(result.error || "An error occurred while resetting your password. Please try again.");
                                            setFormState("error");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        setFormState("error");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-5">
                                        <div>
                                            <label 
                                                htmlFor="password" 
                                                className="block text-my-gray font-medium text-sm mb-1.5"
                                            >
                                                New Password
                                            </label>
                                            <div className="w-full rounded-xl border border-gray-200 focus-within:border-my-blue focus-within:ring-2 focus-within:ring-my-blue/20 flex justify-between items-center bg-white shadow-sm transition-all duration-200">
                                                <Field
                                                    name="password"
                                                    id="password"
                                                    type={isPasswordVisible ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 outline-none rounded-xl text-gray-900 placeholder:text-gray-400 bg-transparent"
                                                />
                                                <div 
                                                    onClick={toggleVisibility} 
                                                    className="cursor-pointer pr-4 flex items-center select-none"
                                                    aria-label="Toggle password visibility"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isPasswordVisible ? (
                                                            <motion.div
                                                                key="eye"
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                transition={{ duration: 0.1 }}
                                                            >
                                                                <Eye size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="eyeClosed"
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                transition={{ duration: 0.1 }}
                                                            >
                                                                <EyeClosed size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="p"
                                                className="text-xs font-medium text-red-500 mt-1.5 ml-1"
                                            />
                                        </div>

                                        <button 
                                            className="w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                                            type="submit" 
                                            disabled={isSubmitting}
                                        >
                                            Reset Password
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

                        {/* Submitting State */}
                        {formState === "submitting" && (
                            <div className="py-6">
                                <InProgress message="Resetting your password, please wait..." />
                            </div>
                        )}

                        {/* Success State */}
                        {formState === "success" && (
                            <div className="flex flex-col items-center text-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <CircleCheckBig size={52} color="#006de2" className="mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Password Updated</h3>
                                <p className="text-sm text-gray-600 max-w-xs mb-6">
                                    {message || "Your password has been reset successfully!"}
                                </p>
                                <Link 
                                    href="/login"
                                    className="w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 px-4 font-semibold hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-center"
                                >
                                    Proceed to Login
                                </Link>
                            </div>
                        )}

                        {/* Error State */}
                        {formState === "error" && (
                            <div className="flex flex-col items-center text-center p-6 bg-red-50/50 rounded-2xl border border-red-100">
                                <XCircle size={52} color="#EF4444" className="mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Reset Failed</h3>
                                <p className="text-sm text-gray-600 max-w-xs mb-6">
                                    {message || "An error occurred while resetting your password. Please try again."}
                                </p>
                                <button 
                                    onClick={() => setFormState("idle")} 
                                    className="w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 px-4 font-semibold hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;