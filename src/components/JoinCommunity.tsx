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
        <section className='bg-my-white pt-14 md:pt-24'>
            <div className='max-w-6xl mx-auto px-4 '>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Join Our Community</h2>
                <p className='text-lg mt-4 max-w-2xl text-center mx-auto'>Join a growing community of disciplined investors, builders, and thinkers who believe that
                    long-term success comes from structure.</p>
                <div className='bg-my-white rounded-3xl max-w-3xl p-5 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-14'>
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
                                    <div className='flex justify-center p-10'>
                                        <PuffLoader size={50} color='#006de2' />
                                    </div>
                                }
                                {submitState === "form" &&
                                    <div className="space-y-4">
                                        <div>
                                            <Field
                                                name="name"
                                                placeholder="Your Name"
                                                autoComplete="name"
                                                className="w-full rounded-xl outline outline-my-blue/20 focus:outline-my-blue/50 px-4 py-3"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="p"
                                                className="text-sm text-red-400 mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="Email address"
                                                autoComplete="email"
                                                className="w-full rounded-xl outline outline-my-blue/20 focus:outline-my-blue/50 px-4 py-3"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="p"
                                                className="text-sm text-red-400 mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Field
                                                name="phone"
                                                placeholder="Phone number"
                                                autoComplete="tel"
                                                className="w-full rounded-xl outline outline-my-blue/20 focus:outline-my-blue/50 px-4 py-3"
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="p"
                                                className="text-sm text-red-400 mt-1"
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
                                            className="w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                                        >
                                            Join Community
                                        </button>

                                    </div>
                                }
                            </Form>
                        )}
                    </Formik>

                    {callResponse && <p className='text-lg text-center'>{callResponse}</p>}
                </div>
            </div>
        </section>
    )
}

export default JoinCommunity;