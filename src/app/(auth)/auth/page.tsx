"use client"

import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState } from "react";

const page = () => {

  const [page, setPage] = useState<"login" | "signup">("signup");

  return (
    <section className='bg-my-white py-14'>
      {
        page === "signup" ?
          <div className="text-center flex flex-col gap-3">
            <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5'>Create Your Account</h2>
            <p className="text-lg">Create your profile to get started.</p>
          </div>
          :
          <div className="text-center flex flex-col gap-3">
            <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Welcome Back</h2>
            <p className="text-lg">Login to your account to continue.</p>
          </div>
      }
      <div className='max-w-6xl mx-auto px-4'>
        <div className='bg-my-white rounded-3xl max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-10'>
          {
            page === "signup" ?
              <SignUp goToLogin={() => setPage("login")} /> :
              <Login goToSignup={() => setPage("signup")} />
          }
        </div>

      </div>
    </section>
  )
}

export default page