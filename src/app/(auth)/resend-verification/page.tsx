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
    <section className='py-14 bg-my-white w-full'>
      <div className='max-w-6xl mx-auto px-4 bg-my-white text-center items-center flex flex-col'>
        <div className='bg-my-white rounded-3xl max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-10 flex flex-col items-center gap-3'>
          <Link href="/">
            <Image
              src="/images/memestructureslogo.png"
              alt="Meme Structures Logo"
              width={250}
              height={70}
            />
          </Link>
          <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1'>Resend Verification Link</h2>
          {
            viewState === "error" && (
              <div className="flex flex-col gap-5 items-center pb-15 px-10">
                <XCircle size={60} color="#006de2" className="mx-auto mt-5" />
                <p className="text-center text-xl">{responseMessage}</p>
                <div className="bg-my-blue text-sm md:text-base px-4 md:px-7 py-3 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer">
                  <Link href="/login">Back to Login</Link>
                </div>
              </div>
            )
          }
          {viewState === "success" &&
            (<div className="flex flex-col gap-5 items-center pb-15 px-10">
              <CircleCheckBig size={60} color="#006de2" className="mx-auto mt-5" />
              <p className="text-center text-xl">{responseMessage}</p>
              <div className="bg-my-blue text-sm md:text-base px-4 md:px-7 py-3 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer">
                <Link href="/login">Back to Login</Link>
              </div>
            </div>)
          }
          {
            viewState === "initial" &&
            (
              <div>
                <p className="text-lg">A new verification link will be send to your email.</p>
                <button onClick={resendVerification} className="bg-my-blue text-sm md:text-base px-4 md:px-7 py-3 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer">
                  Send Link
                </button>
              </div>
            )
          }
          {
            viewState === "submitting" && (
              <div className="flex flex-col gap-5 items-center pb-15 px-10">
                <PuffLoader color="#006de2" size={60} className="mx-auto mt-5" />
                <p className="text-center text-xl">Submitting your information, please wait</p>
              </div>
            )
          }
        </div>
      </div>
    </section>
  );
}