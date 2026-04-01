"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const usernameSchema = Yup.object({
    username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be under 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
        .required("Username is required"),
});



const ChooseUsername = () => {

    const { user, logout, setUser } = useAuth();
    const [formState, setFormState] = useState<"idle" | "submitting" | "response">("idle");
    const [responseMessage, setResponseMessage] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    console.log("Rendering ChooseUsername, user:", user);

    async function generateUsername(email: string) {

        const name = user?.name ? user.name.split(" ")[0] : email.split("@")[0];
       
        try {
            const res = await fetch("/api/user/suggest-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name : name }),
              });

              if (!res.ok) {
                throw new Error("Failed to fetch suggestions");
              } 

              const data = await res.json();

              setSuggestions(data.suggestions);
              console.log("Username suggestions:", data.suggestions);

        } catch (err) {
            console.error("Suggestion error:", err);
        }
    };

    async function setUsername(username: string) {
        setFormState("submitting");

        try {

            const res = await fetch("/api/user/set-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const result = await res.json();

            if (result.success) {

                setUser(result.user);

            } else {

                setFormState("response");
                setResponseMessage(result.error);

            }

        } catch (err) {

            setFormState("response");
            setResponseMessage("Something went wrong");

        }
    }

    return (
        <section className='py-8 bg-my-white w-full min-h-screen flex justify-center'>
            <div className='max-w-6xl w-full mx-auto px-4 bg-my-white'>
                <div className='bg-my-white rounded-3xl w-full max-w-2xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10'>
                    <div className="flex flex-col gap-6">
                        <div className="text-center items-center flex flex-col gap-1">
                            <Link href="/">
                                <Image
                                    src="/images/memestructureslogo.png"
                                    alt="Meme Structures Logo"
                                    width={210}
                                    height={60}
                                />
                            </Link>
                            <h2 className='text-2xl md:text-3xl text-my-deep-blue font-medium mt-1'>Welcome Back {user?.name?.split(" ")[0]}</h2>
                            <p className="text-lg">Choose your Username to continue.</p>
                        </div>
                        <button onClick={logout}>Log out</button>
                        {formState === "idle" && (

                            <Formik
                                initialValues={{ username: "" }}
                                validationSchema={usernameSchema}
                                onSubmit={async (values, { setSubmitting }) => {

                                    setFormState("submitting");

                                    try {

                                        const res = await fetch("/api/user/set-username", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(values),
                                        });

                                        const result = await res.json();

                                        if (result.success) {

                                            //setUser(result.user);

                                        } else {

                                            setFormState("response");
                                            setResponseMessage(result.error);

                                        }

                                    } catch (err) {

                                        setFormState("response");
                                        setResponseMessage("Something went wrong");

                                    } finally {

                                        setSubmitting(false);

                                    }

                                }}
                            >

                                {({ isSubmitting, setFieldValue }) => (

                                    <Form className="space-y-3">

                                        <div>
                                            <label className="text-sm text-gray-600">
                                                Username
                                            </label>

                                            <div className="flex gap-2 mt-1">

                                                <Field
                                                    name="username"
                                                    placeholder="choose a username"
                                                    className="mt-1 flex-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-deep-blue/40 px-4 py-3"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => generateUsername(user?.email || "")}
                                                    className="px-4 rounded-xl shadow-md shadow-my-gray/10 hover:ring cursor-pointer hover:ring-my-deep-blue transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Image alt="" src="/images/sparkle.png" width={20} height={20} />
                                                    <span className="text-my-deep-blue">Generate</span>
                                                </button>

                                            </div>

                                            <ErrorMessage
                                                name="username"
                                                component="p"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>
                                        <div>
                                            {
                                                suggestions.length > 0 && (
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        {suggestions.map((suggestion, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => setFieldValue("username", suggestion)}
                                                                className="px-4 py-2 rounded-xl shadow-md shadow-my-gray/10 hover:ring text-my-deep-blue cursor-pointer hover:ring-my-deep-blue transition-all duration-300 flex items-center gap-2"
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                                        >
                                            Continue
                                        </button>

                                    </Form>

                                )}

                            </Formik>
                        )}

                        {formState === "submitting" && (
                            <p className="text-center">Saving username...</p>
                        )}

                        {formState === "response" && (
                            <div className="text-center">
                                <p>{responseMessage}</p>
                                <button onClick={() => setFormState("idle")}>
                                    Try again
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );

}

export default ChooseUsername