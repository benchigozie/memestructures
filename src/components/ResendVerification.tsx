"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { XCircle, CircleCheckBig } from "lucide-react";
import { PuffLoader } from "react-spinners";

export default function VerifyAccountPage() {

  const [responseMessage, setResponseMessage] = useState("");
  const [viewState, setViewState] = useState<"initial" | "submitting" | "success" | "error">("initial");
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const resendVerification = async () => {

    setViewState('submitting');
    const response = await fetch("/api/user/resend-verification", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      setResponseMessage(result.message);
      setViewState("success");
    } else {
      setResponseMessage(result.error || "An error occurred while resending the verification email.");
      setViewState("error");
    }
  };

  return (
    <section className='py-14 bg-my-white w-full min-h-screen flex'>
      <div className='max-w-6xl mx-auto px-4 bg-my-white text-center items-center flex flex-col'>
        <div className='bg-my-white rounded-3xl max-w-2xl w-full p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 flex flex-col items-center gap-3'>
          <Link href="/">
            <Image
              src="/images/memestructureslogo.png"
              alt="Meme Structures Logo"
              width={250}
              height={70}
            />
          </Link>
          <h2 className='text-2xl md:text-4xl text-my-deep-blue font-bold'>Resend Verification Link</h2>
          {
            viewState === "error" && (
              <div className="flex flex-col gap-3 items-center w-full">
                <XCircle size={50} color="#006de2" className="mx-auto mt-2" />
                <p className="text-center text-xl">{responseMessage}</p>
                <div className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">
                  <Link href="/login">Back to Login</Link>
                </div>
              </div>
            )
          }
          {viewState === "success" &&
            (<div className="flex flex-col gap-3 items-center w-full">
              <CircleCheckBig size={50} color="#006de2" className="mx-auto mt-2" />
              <p className="text-center text-lg">{responseMessage}</p>
              <div className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">
                <Link href="/login">Back to Login</Link>
              </div>
            </div>)
          }
          {
            viewState === "initial" &&
            (
              <div className="flex flex-col gap-3 items-center w-full">
                <p className="text-lg">A new verification link will be sent to your email.</p>
                <button onClick={resendVerification} className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">
                  Send Link
                </button>
              </div>
            )
          }
          {
            viewState === "submitting" && (
              <div className="flex flex-col gap-3 items-center pb-6 w-full">
                <PuffLoader color="#006de2" size={50} className="mx-auto mt-5" />
                <p className="text-center text-xl">Submitting, please wait</p>
              </div>
            )
          }
        </div>
      </div>
    </section>
  );
}