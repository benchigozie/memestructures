"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { XCircle, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InProgress from "./InProgress";

export default function VerifyEmailPage() {
    const params = useSearchParams();
    const token = params.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    console.log("Token from URL:", token);

    useEffect(() => {
        if (!token) {

            setMessage("No token provided.");
            setStatus("error");
            return;
        }

        async function verify() {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const result = await res.json();

                if (result.success) {

                    setMessage(result.message);
                    setStatus("success");
                } else {

                    setMessage(result.error);
                    setStatus("error");
                }
            } catch (err) {

                setMessage("An unexpected error occurred.");
                setStatus("error");
            }
        }

        verify();
    }, [token]);

    return (
        <section className='py-14 bg-my-white w-full min-h-screen flex'>
            <div className='max-w-6xl w-full mx-auto px-4 bg-my-white text-center items-center flex flex-col'>
                <div className='bg-my-white max-w-2xl rounded-3xl w-full p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 flex flex-col items-center gap-3'>
                    <Link href="/">
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={250}
                            height={70}
                        />
                    </Link>
                    {status === "loading" && <InProgress message="Verifying" />}
                    {status === "success" && (
                        <div className="text-center">
                            <CircleCheckBig size={50} color="#006de2" className="mx-auto mb-3" />
                            <h1 className="text-xl">{message || "Email verified successfully!"}</h1>
                            <Link href="/login" className="mt-4 inline-block bg-my-blue text-white px-6 py-3 rounded-xl">
                                Go to Login
                            </Link>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="text-center">
                            <XCircle size={50} color="#E02424" className="mx-auto mb-3" />
                            <h1 className="text-xl">{message || "Verification failed."}</h1>
                            <Link href="/login" className="mt-4 inline-block bg-my-blue text-white px-6 py-3 rounded-xl">
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}