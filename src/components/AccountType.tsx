"use client"

import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext";
import ErrorResponse from "./ErrorResponse";
import SuccessResponse from "./SuccessResponse";
import InProgress from "./InProgress";

const AccountType = () => {

    const [selectedType, setSelectedType] = useState<"INDIVIDUAL" | "ENTERPRISE" | null>(null);
    const [actionState, setActionState] = useState<"idle" | "submitting" | "error" | "success">("idle");
    const [responseMessage, setResponseMessage] = useState("");

    const { user, setUser } = useAuth();

    const updateAccountType = async (type: "INDIVIDUAL" | "ENTERPRISE") => {

        setSelectedType(type);
        setActionState("submitting");

        try {

            const response = await fetch("/api/user/update-account-type", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accountType: type }),
            });

            const result = await response.json();

            if (result.success) {

                setUser(result.user);

                setActionState("success");

            } else {
                setResponseMessage(result.error || "Something went wrong.");
                setActionState("error");
            }

        } catch (err) {
            console.error(err);
            setResponseMessage("An unexpected error occurred.");
            setActionState("error");
        }
    };

    return (

        <section className='py-8 bg-my-white w-full min-h-screen flex justify-center'>
            <div className='max-w-6xl w-full mx-auto px-4 bg-my-white'>
                <div className='bg-my-white rounded-3xl w-full max-w-2xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10'>

                    {
                        actionState === "idle" && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold text-center'>Choose Account Type</h2>
                                    <p className="text-center text-lg text-my-gray">Select the account type that best describes you to help us tailor your experience.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                                    <div onClick={() => {
                                        setSelectedType("INDIVIDUAL");
                                        updateAccountType("INDIVIDUAL");
                                    }} className='bg-my-white rounded-3xl flex flex-col gap-1.5 text-center w-full max-w-2xl p-4 md:p-6 mx-auto hover:shadow-2xl hover:shadow-my-gray/10 duration-500 transition-all cursor-pointer outline outline-my-deep-blue/10'>
                                        <div className="p-5 rounded-2xl bg-my-blue-white/60 w-max mx-auto">
                                            <Image src="/images/individual.png" width={35} height={35} alt="" className="w-16 h-16" />
                                        </div>
                                        <h3 className="text-2xl text-my-blue font-semibold mt-3">Individual</h3>
                                        <p>I'm an individual looking to invest in alternative assets.</p>
                                    </div>
                                    <div onClick={() => {
                                        setSelectedType("ENTERPRISE");
                                        updateAccountType("ENTERPRISE");
                                    }}
                                        className='bg-my-white rounded-3xl flex flex-col gap-1.5 text-center w-full max-w-2xl p-4 md:p-6 mx-auto hover:shadow-2xl hover:shadow-my-gray/10 duration-500 transition-all cursor-pointer outline outline-my-deep-blue/10'>
                                        <div className="p-5 rounded-2xl bg-my-blue-white/60 w-max mx-auto">
                                            <Image src="/images/enterprise.png" width={35} height={35} alt="" className="w-16 h-16" />
                                        </div>
                                        <h3 className="text-2xl text-my-blue font-semibold mt-3">Enterprise</h3>
                                        <p>I am an enterprise looking to invest in alternative assets.</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        actionState === "error" && (
                            <ErrorResponse
                                message={responseMessage}
                                callableFunction={() => {
                                setActionState("idle");
                                setResponseMessage("");
                            }} />
                        )
                    }
                    {
                        actionState === "success" && (
                           <SuccessResponse
                                message="Your account type has been updated successfully!"
                                callableFunction={() => {
                                    setActionState("idle");
                                    setResponseMessage("");
                            }} />
                        )
                    }
                    {
                        actionState === "submitting" && (
                           <InProgress message="Updating your account type, please wait..." />
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default AccountType