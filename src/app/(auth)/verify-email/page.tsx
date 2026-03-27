"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { XCircle, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailPage() {
    const params = useSearchParams();
    const token = params.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    console.log("Token from URL:", token);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No token provided.");
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
                    setStatus("success");
                    setMessage(result.message);
                } else {
                    setStatus("error");
                    setMessage(result.error);
                }
            } catch (err) {
                setStatus("error");
                setMessage("An unexpected error occurred.");
            }
        }

        verify();
    }, [token]);

    return (
        <section className="flex flex-col items-center justify-center py-20">
            <Link href="/">
                <Image
                    src="/images/memestructureslogo.png"
                    alt="Meme Structures Logo"
                    width={250}
                    height={70}
                />
            </Link>
            {status === "loading" && <PuffLoader color="#006de2" size={60} />}
            {status === "success" && (
                <div className="text-center">
                    <CircleCheckBig size={60} color="#006de2" className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold">{message || "Email verified successfully!"}</h1>
                    <Link href="/login" className="mt-4 inline-block bg-my-blue text-white px-6 py-3 rounded-xl">
                        Go to Login
                    </Link>
                </div>
            )}
            {status === "error" && (
                <div className="text-center">
                    <XCircle size={60} color="#E02424" className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold">{message || "Verification failed."}</h1>
                    <Link href="/login" className="mt-4 inline-block bg-my-blue text-white px-6 py-3 rounded-xl">
                        Back to Login
                    </Link>
                </div>
            )}
        </section>
    );
}