"use client"

import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PuffLoader } from 'react-spinners';

const joinCommunitySchema = Yup.object({
    name: Yup.string()
        .min(2, "Name is too short")
        .required("Name is required"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    phone: Yup.string()
        .matches(/^[0-9+\-\s()]+$/, "Invalid phone number")
        .required("Phone number is required"),
});

function JoinCommunity() {

    const [callResponse, setCallResponse] = useState("");
    const [submitState, setSubmitState] = useState<"form" | "submitting" | "submitted">("form");

    return (
        <section className='bg-my-white pt-16 md:pt-24 pb-12'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6'>
                {/* Header Section */}
                <div className='text-center max-w-2xl mx-auto'>
                    <h2 className='text-3xl md:text-4xl text-my-deep-blue font-extrabold tracking-tight'>
                        Join Our Community
                    </h2>
                    <p className='text-base md:text-lg mt-3.5 leading-relaxed opacity-90'>
                        Join a growing community of disciplined investors, builders, and thinkers who believe that
                        long-term success comes from structure.
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-my-white rounded-3xl max-w-xl p-6 sm:p-10 md:p-12 mx-auto shadow-xl shadow-my-gray/10 border border-my-gray/10 mt-10 md:mt-12'>
                    <Formik
                        initialValues={{ name: "", email: "", phone: "", company: "" }}
                        validationSchema={joinCommunitySchema}
                        onSubmit={async (values, { resetForm, setSubmitting }) => {
                            setSubmitState("submitting");
                            try {
                                const response = await fetch("/api/lead", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(values),
                                });

                                const result = await response.json();

                                if (result.success) {
                                    setCallResponse("Welcome, you are now part of our community")
                                    setSubmitState("submitted")
                                    resetForm();
                                } else {
                                    setCallResponse(result.error)
                                    setSubmitState("submitted")
                                }
                            } catch (err) {
                                console.error(err);
                                setCallResponse("Couldn't submit. Try again later.")
                                setSubmitState("submitted");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {isSubmitting &&
                                    <div className='flex flex-col items-center justify-center p-8 space-y-3'>
                                        <PuffLoader size={50} color='#006de2' />
                                        <span className="text-sm font-medium opacity-70">Submitting your request...</span>
                                    </div>
                                }
                                {submitState === "form" &&
                                    <div className="space-y-5">
                                        <div>
                                            <Field
                                                name="name"
                                                placeholder="Your Name"
                                                autoComplete="name"
                                                className="w-full rounded-xl border border-my-blue/20 bg-my-white/50 focus:bg-my-white focus:border-my-blue focus:ring-2 focus:ring-my-blue/20 outline-none px-4 py-3.5 text-sm transition-all duration-200"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="p"
                                                className="text-xs text-red-500 font-medium mt-1.5 ml-1"
                                            />
                                        </div>

                                        <div>
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="Email address"
                                                autoComplete="email"
                                                className="w-full rounded-xl border border-my-blue/20 bg-my-white/50 focus:bg-my-white focus:border-my-blue focus:ring-2 focus:ring-my-blue/20 outline-none px-4 py-3.5 text-sm transition-all duration-200"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="p"
                                                className="text-xs text-red-500 font-medium mt-1.5 ml-1"
                                            />
                                        </div>

                                        <div>
                                            <Field
                                                name="phone"
                                                placeholder="Phone number"
                                                autoComplete="tel"
                                                className="w-full rounded-xl border border-my-blue/20 bg-my-white/50 focus:bg-my-white focus:border-my-blue focus:ring-2 focus:ring-my-blue/20 outline-none px-4 py-3.5 text-sm transition-all duration-200"
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="p"
                                                className="text-xs text-red-500 font-medium mt-1.5 ml-1"
                                            />
                                        </div>

                                        <Field
                                            type="text"
                                            name="company"
                                            className="hidden"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full rounded-xl bg-my-blue hover:bg-my-deep-blue text-white py-3.5 px-6 font-semibold shadow-md shadow-my-blue/20 hover:shadow-lg hover:shadow-my-blue/30 cursor-pointer active:scale-[0.99] transition-all duration-200 mt-2"
                                        >
                                            Join Community
                                        </button>
                                    </div>
                                }
                            </Form>
                        )}
                    </Formik>

                    {callResponse && (
                        <div className="mt-6 p-4 rounded-xl bg-my-blue/5 border border-my-blue/20 text-center">
                            <p className='text-base font-medium text-my-deep-blue'>{callResponse}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default JoinCommunity;