"use client";

import Image from 'next/image'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import { XCircle, CircleCheckBig } from "lucide-react";
import { PuffLoader } from "react-spinners";

const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
});


const page = () => {

    const [formState, setFormState] = useState<"idle" | "submitting" | "error" | "success">("idle");
    const [responseMessage, setResponseMessage] = useState("");


    return (
        <section className='py-14 bg-my-white w-full min-h-screen'>
            <div className='max-w-6xl mx-auto px-4 bg-my-white items-center flex flex-col'>
                <div className='bg-my-white rounded-3xl max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-10 flex flex-col items-center gap-3'>
                    <Link href="/">
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={250}
                            height={70}
                        />
                    </Link>
                    <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1'>Reset Password</h2>
                    {
                        formState === "error" && (
                            <div className="flex flex-col gap-5 items-center pb-6 w-full">
                                <XCircle size={60} color="#006de2" className="mx-auto mt-5" />
                                <p className="text-center text-xl">{responseMessage}</p>
                                <button className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">
                                    <Link href="/login">Back to Login</Link>
                                </button>
                            </div>
                        )
                    }
                    {
                        formState === "success" &&
                        (<div className="flex flex-col gap-5 items-center pb-6 w-full">
                            <CircleCheckBig size={60} color="#006de2" className="mx-auto mt-5" />
                            <p className="text-center text-xl">{responseMessage}</p>
                            <button className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">
                                <Link href="/login">
                                    Back to Login
                                </Link>
                            </button>
                        </div>)
                    }
                    {
                        formState === "submitting" && (
                            <div className="flex flex-col gap-5 items-center pb-6 w-full">
                                <PuffLoader color="#006de2" size={60} className="mx-auto mt-5" />
                                <p className="text-center text-xl">Submitting your information, please wait</p>
                            </div>
                        )
                    }
                    {

                        formState === "idle" &&
                        (<Formik
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
                                    }
                                    else {
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
                                <Form>
                                    <div>
                                        <label htmlFor="email" className="text-my-gray/85 text-[15px]">Enter Your Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            id="email"
                                            placeholder="john@examplemail.com"
                                            autoComplete="email"
                                            className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="p"
                                            className="text-sm text-red-400 mt-1"
                                        />
                                    </div>

                                    <button className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300" type="submit" disabled={isSubmitting}>
                                        Send Reset Link
                                    </button>
                                </Form>
                            )}
                        </Formik>)
                    }
                </div>
            </div>
        </section>
    )
}

export default page