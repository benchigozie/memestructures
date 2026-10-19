"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Eye, EyeClosed, XCircle } from "lucide-react";
import { PuffLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InProgress from "@/components/InProgress";
import OtpInput from "@/components/OtpInput";
import { getInitials } from "@/utils/getInitials";

const loginSchema = Yup.object({
  identifier: Yup.string().required("Email or username is required"),
  password: Yup.string().required("Password is required")
});

const otpSchema = Yup.object({
  code: Yup.string()
    .length(6, "Verification code must be exactly 6 digits")
    .matches(/^[0-9]+$/, "Code must contain only numbers")
    .required("Verification code is required")
});

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [formState, setFormState] = useState<"idle" | "otp-step" | "submitting" | "error" | "success">("idle");
  const [pendingUserId, setPendingUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const setToError = () => setFormState("error");
  const setToIdle = () => setFormState("idle");
  const setToSuccess = () => setFormState("success");

  useEffect(() => {
    if (user) {
      console.log("User is logged in, redirecting to dashboard from login page useeffect");
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <section className='bg-my-white py-8 min-h-screen flex justify-center'>
      <div className="flex flex-col gap-3 w-full">
        <div className='w-full mx-auto px-4'>
          <div className='bg-my-white max-w-2xl rounded-3xl w-full p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 flex flex-col gap-5'>
            <div className="text-center items-center flex flex-col gap-1">
              <Link href="/">
                <Image
                  src="/images/memestructureslogo.png"
                  alt="Meme Structures Logo"
                  width={210}
                  height={60}
                />
              </Link>
              <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>
                {formState === "otp-step" ? "Security Verification" : "Welcome Back"}
              </h2>
              <p className="text-lg">
                {formState === "otp-step"
                  ? "Enter the 6-digit code sent to your account"
                  : "Login to your account to continue."}
              </p>
            </div>

            {/* FORM STATE 1: INITIAL USERNAME/EMAIL & PASSWORD */}
            {formState === "idle" && (
              <Formik
                initialValues={{ identifier: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setFormState("submitting");

                  try {
                    const response = await fetch("/api/user/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });

                    const result = await response.json();
                    console.log("Login initial response:", result);

                    if (result.error === "Your email is not verified") {
                      setUserEmail(result.user?.email || "");
                    }

                    if (result.requiresOtp && result.userId) {
                      setPendingUserId(result.userId);
                      setUserEmail(result.email || "");
                      setFormState("otp-step");
                    } else if (result.success) {
                      setUser({
                        ...result.user,
                        initials: getInitials(result.user.name),
                      });
                      setToSuccess();
                    } else {
                      setFormState("error");
                      setResponseMessage(result.error);
                    }
                  } catch (err) {
                    setResponseMessage("An unexpected error occurred. Please try again.");
                    setToError();
                    console.error("Login error:", err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="identifier" className="text-my-gray/85 text-[15px]">Enter Your Email or Username</label>
                        <Field
                          name="identifier"
                          type="text"
                          id="identifier"
                          placeholder="Email or Username"
                          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                        />
                        <ErrorMessage name="identifier" component="p" className="text-sm text-red-400 mt-1" />
                      </div>
                      <div>
                        <label htmlFor="password" className="text-my-gray/85 text-[15px]">Enter Your Password</label>
                        <div className="mt-1 rounded-xl outline outline-my-blue/15 focus-within:outline-my-blue/40 flex justify-between">
                          <Field
                            name="password"
                            id="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="********"
                            className="w-full px-4 py-3 outline-none rounded-xl"
                          />
                          <div onClick={toggleVisibility} className="cursor-pointer pr-4 flex items-center">
                            <AnimatePresence mode="wait">
                              {isPasswordVisible ? (
                                <motion.div key="eye" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <Eye size={21} stroke="#A0A3AB" />
                                </motion.div>
                              ) : (
                                <motion.div key="eyeClosed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <EyeClosed size={21} stroke="#A0A3AB" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <ErrorMessage name="password" component="p" className="text-sm text-red-400 mt-1" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                      >
                        Login
                      </button>
                      <p className="mt-2 text-[15px] text-center text-my-gray/70">
                        Forgot Your Password? <span className="text-my-blue/80 cursor-pointer"><Link href="/forgot-password">Reset</Link></span>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* FORM STATE 2: OTP VERIFICATION CODE */}
            {formState === "otp-step" && (
              <Formik
                initialValues={{ code: "" }}
                validationSchema={otpSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setFormState("submitting");

                  try {
                    const response = await fetch("/api/auth/verify-otp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: pendingUserId, code: values.code }),
                    });

                    const result = await response.json();
                    console.log("OTP verification response:", result);

                    if (result.success) {
                      setUser({
                        ...result.user,
                        initials: getInitials(result.user.name),
                      });
                      setToSuccess();
                    } else {
                      setResponseMessage(result.error || "Invalid verification code.");
                      setToError();
                    }
                  } catch (err) {
                    setResponseMessage("An unexpected error occurred during verification.");
                    setToError();
                    console.error("OTP verification error:", err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center">
                        <label htmlFor="code" className="text-my-gray/85 text-[15px] mb-3 block text-center font-medium">
                          6-Digit Verification Code
                        </label>
                        <OtpInput name="code" length={6} />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300 shadow-md shadow-my-blue/20"
                      >
                        Verify & Login
                      </button>

                      <button
                        type="button"
                        onClick={setToIdle}
                        className="w-full text-sm text-my-gray/70 text-center hover:underline cursor-pointer"
                      >
                        Back to password login
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* SUBMITTING STATE */}
            {formState === "submitting" && (
              <div className="flex flex-col gap-5 items-center py-5 px-10 w-full">
                <PuffLoader color="#006de2" size={60} className="mx-auto" />
                <p className="text-center text-xl">Processing, please wait...</p>
              </div>
            )}

            {/* ERROR STATE */}
            {formState === "error" && (
              <div className="flex flex-col gap-5 items-center">
                {responseMessage === "Your email is not verified" ? (
                  <div className="py-3 flex flex-col gap-4 items-center w-full">
                    <XCircle size={60} color="#006de2" className="mx-auto" />
                    <p className="text-center text-2xl">{responseMessage}</p>
                    <p className="text-center">Check your email inbox for your verification link. You can also request a new link below.</p>
                    <Link href={`/resend-verification?email=${userEmail}`} className="flex justify-center w-full">
                      <div className="mt-6 w-full text-center rounded-xl bg-my-blue text-white py-3 font-medium">Resend</div>
                    </Link>
                  </div>
                ) : (
                  <div className="py-3 flex flex-col gap-3 items-center w-full">
                    <XCircle size={50} color="#006de2" className="mx-auto" />
                    <p className="text-center text-lg">{responseMessage}</p>
                    <button onClick={setToIdle} className="mt-6 w-full rounded-xl bg-my-blue text-white py-3 font-medium cursor-pointer">Back to Form</button>
                  </div>
                )}
              </div>
            )}

            {/* SUCCESS STATE */}
            {formState === "success" && <InProgress message="Logging in" />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;