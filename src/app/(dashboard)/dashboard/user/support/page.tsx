"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRef, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import InProgress from "@/components/InProgress";
import ErrorResponse from "@/components/ErrorResponse";
import SuccessResponse from "@/components/SuccessResponse";

type SupportFormValues = {
    subject: string;
    category: string;
    message: string;
    attachment: File | null;
};

const supportSchema = Yup.object({
    subject: Yup.string()
        .required("Subject is required")
        .min(5, "Subject is too short"),

    category: Yup.string().required("Select a category"),

    message: Yup.string()
        .required("Message is required")
        .min(20, "Please provide more details"),
});

const SupportPage = () => {
    const [formState, setFormState] = useState<
        "idle" | "submitting" | "error" | "success"
    >("idle");

    const [responseMessage, setResponseMessage] = useState("");

    const attachmentRef = useRef<HTMLInputElement>(null);

    async function submitTicket(values: SupportFormValues) {
        setFormState("submitting");
    
        const formData = new FormData();
    
        formData.append("subject", values.subject);
        formData.append("category", values.category);
        formData.append("message", values.message);
    
        if (values.attachment) {
            formData.append("attachment", values.attachment);
        }
    
        try {
            const res = await fetchWithAuth("/api/user/support", {
                method: "POST",
                body: formData,
            });
    
            const data = await res.json();
    
            if (data.success) {
                setFormState("success");
                setResponseMessage(
                    data.message || "Support ticket submitted successfully."
                );
            } else {
                setFormState("error");
                setResponseMessage(
                    data.error || "Something went wrong."
                );
            }
        } catch (err) {
            console.error(err);
    
            setFormState("error");
            setResponseMessage(
                "Unexpected error occurred."
            );
        }
    }

    return (
        <div className="p-4 md:p-10">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100 max-w-xl">
                <section className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-my-deep-blue">
                        Contact Support
                    </h1>

                    <p className="text-gray-600 text-[17px]">
                        Need help with an investment, withdrawal, KYC verification,
                        or account issue? Send us a message and our support team
                        will get back to you as soon as possible.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-my-deep-blue mb-4">
                        Support Information
                    </h2>

                    {formState === "idle" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs">
                                    RESPONSE TIME
                                </span>

                                <p className="font-medium text-my-deep-blue">
                                    Within 24 Hours
                                </p>
                            </div>

                            <div>
                                <span className="text-xs">
                                    AVAILABILITY
                                </span>

                                <p className="font-medium text-my-deep-blue">
                                    24/7 Support
                                </p>
                            </div>

                        </div>
                    )}
                </section>

                <section className="mt-6">
                    {formState === "idle" && (
                        <Formik<SupportFormValues>
                            initialValues={{
                                subject: "",
                                category: "",
                                message: "",
                                attachment: null,
                            }}
                            validationSchema={supportSchema}
                            onSubmit={submitTicket}
                        >
                            {({
                                values,
                                setFieldValue,
                                isValid,
                                dirty,
                            }) => (
                                <Form>
                                    <div>
                                        <label className="text-sm text-my-deep-blue font-medium">
                                            Subject
                                        </label>

                                        <Field
                                            name="subject"
                                            type="text"
                                            placeholder="Brief description of your issue"
                                            className="w-full outline outline-my-gray/40 focus:outline-my-deep-blue rounded-lg px-4 py-3 mt-2"
                                        />

                                        <ErrorMessage
                                            name="subject"
                                            component="p"
                                            className="text-red-500 text-sm mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-sm text-my-deep-blue font-medium">
                                            Category
                                        </label>

                                        <Field
                                            as="select"
                                            name="category"
                                            className="w-full mt-2 px-4 py-3 rounded-lg border border-my-gray/40 focus:border-my-deep-blue outline-none"
                                        >

                                            <option value="">
                                                Select category
                                            </option>

                                            <option value="investment">
                                                Investment
                                            </option>

                                            <option value="withdrawal">
                                                Withdrawal
                                            </option>

                                            <option value="kyc">
                                                KYC Verification
                                            </option>

                                            <option value="account">
                                                Account Issue
                                            </option>

                                            <option value="technical">
                                                Technical Problem
                                            </option>

                                            <option value="other">
                                                Other
                                            </option>
                                        </Field>

                                        <ErrorMessage
                                            name="category"
                                            component="p"
                                            className="text-red-500 text-sm mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-sm text-my-deep-blue font-medium">
                                            Message
                                        </label>

                                        <Field
                                            as="textarea"
                                            name="message"
                                            rows={6}
                                            placeholder="Describe your issue in detail..."
                                            className="w-full mt-2 outline outline-my-gray/40 focus:outline-my-deep-blue rounded-lg px-4 py-3 resize-none"
                                        />

                                        <ErrorMessage
                                            name="message"
                                            component="p"
                                            className="text-red-500 text-sm mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-my-deep-blue text-[15px]">
                                            Attachment (Optional)
                                        </label>

                                        <input
                                            ref={attachmentRef}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.currentTarget.files?.[0];

                                                if (file) {
                                                    setFieldValue(
                                                        "attachment",
                                                        file
                                                    );
                                                }
                                            }}
                                        />

                                        <div
                                            onClick={() =>
                                                attachmentRef.current?.click()
                                            }
                                            className="mt-2 cursor-pointer border-2 border-dashed border-my-gray/40 hover:border-my-deep-blue rounded-xl p-8 text-center"
                                        >
                                            <Image
                                                src="/images/upload.png"
                                                alt="Upload"
                                                width={40}
                                                height={40}
                                                className="mx-auto mb-2"
                                            />

                                            {values.attachment ? (
                                                <p className="font-medium text-my-deep-blue">
                                                    ✓ {values.attachment.name}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500">
                                                    Upload screenshot, PDF or
                                                    supporting document
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!dirty || !isValid}
                                        className="mt-6 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg disabled:opacity-50 duration-300 transition-colors cursor-pointer"
                                    >
                                        Submit Ticket
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {formState === "submitting" && (
                        <InProgress message="Submitting your support request" />
                    )}

                    {formState === "error" && (
                        <div>
                            <ErrorResponse message={responseMessage} />

                            <button
                                onClick={() => setFormState("idle")}
                                className="mt-4 w-full bg-my-blue hover:bg-my-deep-blue text-white py-3 rounded-lg"
                            >
                                Back to Support Form
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
                                Submit Another Ticket
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SupportPage;