"use client";

import Image from 'next/image'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
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


const page = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const params = useSearchParams();
    const token = params.get("token");
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const toggleVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    return (
        <section className='py-14 bg-my-white w-full'>
            <div className='max-w-6xl mx-auto px-4 bg-my-white items-center flex flex-col'>
                <div className='bg-my-white rounded-3xl w-full max-w-xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-10 flex flex-col items-center gap-3'>
                    <div className='w-full flex flex-col gap-3'>
                        <Link href="/">
                            <Image
                                src="/images/memestructureslogo.png"
                                alt="Meme Structures Logo"
                                width={250}
                                height={70}
                            />
                        </Link>
                        <h2 className='text-center text-2xl md:text-3xl text-my-deep-blue font-bold mt-1'>Choose a New Password</h2>

                        {
                            formState === "idle" && (
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
                                            }
                                            else {
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

                                        <Form>
                                            <div>
                                                <label htmlFor="password" className="text-my-gray/85 text-[15px]">Choose Your Password</label>
                                                <div className="mt-1 rounded-xl outline outline-my-blue/15 focus-within:outline-my-blue/40 flex justify-between items-center">
                                                    <Field
                                                        name="password"
                                                        id="password"
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="********"
                                                        className="w-full px-4 py-3 outline-none rounded-xl"
                                                    />
                                                    <div onClick={toggleVisibility} className="cursor-pointer pr-4 flex items-center">
                                                        <AnimatePresence mode="wait">
                                                            {isPasswordVisible ? (
                                                                <motion.div
                                                                    key="eye"
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    transition={{ duration: 0.1 }}
                                                                >
                                                                    <Eye size={21} stroke="#A0A3AB" />
                                                                </motion.div>
                                                            ) : (
                                                                <motion.div
                                                                    key="eyeClosed"
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    transition={{ duration: 0.1 }}
                                                                >
                                                                    <EyeClosed size={21} stroke="#A0A3AB" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                                <ErrorMessage
                                                    name="password"
                                                    component="p"
                                                    className="text-sm text-red-400 mt-1"
                                                />

                                                <button className="mt-4 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300" type="submit" disabled={isSubmitting}>
                                                    Reset Password
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            )
                        }

                        {
                            formState === "submitting" && (
                                <InProgress message="Resetting your password, please wait" />
                            )
                        }

                        {
                            formState === "success" && (
                                <div className="flex flex-col gap-4 items-center py-5">
                                    <p className="text-center text-lg">{message || "Your password has been reset successfully!"}</p>
                                    <button onClick={() => setFormState("idle")} className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
                                </div>
                            )
                        }

                        {
                            formState === "error" && (
                                <div className="flex flex-col gap-4 items-center py-5">
                                    <p className="text-center text-lg">{message || "An error occurred while resetting your password. Please try again."}</p>
                                    <button onClick={() => setFormState("idle")} className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}

export default page