"use client";

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
  password: Yup.string().required("Password is required"),
});

const otpSchema = Yup.object({
  code: Yup.string()
    .length(6, "Verification code must be exactly 6 digits")
    .matches(/^[0-9]+$/, "Code must contain only numbers")
    .required("Verification code is required"),
});

/* ---------- shared style tokens ---------- */
const labelClass = "block text-sm font-medium text-my-gray";
const inputShell =
  "mt-1.5 flex items-center rounded-xl border border-my-blue/20 bg-white transition-colors focus-within:border-my-blue focus-within:ring-4 focus-within:ring-my-blue/10";
const inputClass =
  "w-full bg-transparent px-4 py-3 text-base text-my-gray placeholder:text-my-gray/40 outline-none overflow-hidden";
const errorClass = "mt-1.5 text-sm text-red-500";
const primaryButton =
  "w-full rounded-xl bg-my-blue px-4 py-3 text-base font-medium text-white transition-colors hover:bg-my-deep-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-my-blue/25 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";
const textButton =
  "w-full text-center text-sm text-my-gray/70 transition-colors hover:text-my-blue cursor-pointer";

type FormState = "idle" | "otp-step" | "submitting" | "error" | "success";

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [formState, setFormState] = useState<FormState>("idle");
  const [pendingUserId, setPendingUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible((v) => !v);
  const setToError = () => setFormState("error");
  const setToIdle = () => setFormState("idle");
  const setToSuccess = () => setFormState("success");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const isOtp = formState === "otp-step";

  return (
    <main className="flex min-h-screen items-center justify-center bg-my-white px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-my-blue/10 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-8px_rgba(16,24,40,0.08)] sm:p-10">
          {/* HEADER */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" aria-label="Meme Structures home">
              <Image
                src="/images/memestructureslogo.png"
                alt="Meme Structures"
                width={150}
                height={43}
                priority
                className="h-auto w-[130px] sm:w-[150px]"
              />
            </Link>
            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-my-deep-blue sm:text-[28px] sm:leading-9">
              {isOtp ? "Verify it's you" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-my-gray/70 sm:text-base">
              {isOtp
                ? "Enter the 6-digit code we sent to your account."
                : "Log in to your account to continue."}
            </p>
          </div>

          <div className="mt-8">
            {/* FORM STATE 1: EMAIL/USERNAME & PASSWORD */}
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
                  <Form noValidate className="flex flex-col gap-5">
                    <div>
                      <label htmlFor="identifier" className={labelClass}>
                        Email or username
                      </label>
                      <div className={inputShell}>
                        <Field
                          name="identifier"
                          id="identifier"
                          type="text"
                          autoComplete="username"
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>
                      <ErrorMessage name="identifier" component="p" className={errorClass} />
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between">
                        <label htmlFor="password" className={labelClass}>
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-my-blue transition-colors hover:text-my-deep-blue"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className={inputShell}>
                        <Field
                          name="password"
                          id="password"
                          type={isPasswordVisible ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                          className="mr-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-my-gray/50 transition-colors hover:text-my-gray"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={isPasswordVisible ? "eye" : "eyeClosed"}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.12 }}
                              className="flex"
                            >
                              {isPasswordVisible ? <Eye size={20} /> : <EyeClosed size={20} />}
                            </motion.span>
                          </AnimatePresence>
                        </button>
                      </div>
                      <ErrorMessage name="password" component="p" className={errorClass} />
                    </div>

                    <button type="submit" disabled={isSubmitting} className={`${primaryButton} mt-1`}>
                      Log in
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            {/* FORM STATE 2: OTP VERIFICATION */}
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
                  <Form noValidate className="flex flex-col gap-6">
                    <div className="flex flex-col items-center">
                      <label htmlFor="code" className={`${labelClass} mb-3 text-center`}>
                        Verification code
                      </label>
                      <OtpInput name="code" length={6} />
                    </div>

                    <div className="flex flex-col gap-3">
                      <button type="submit" disabled={isSubmitting} className={primaryButton}>
                        Verify and log in
                      </button>
                      <button type="button" onClick={setToIdle} className={textButton}>
                        Back to password login
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* SUBMITTING STATE */}
            {formState === "submitting" && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-4 py-6"
              >
                <PuffLoader color="#006de2" size={48} />
                <p className="text-center text-base text-my-gray/70">Checking your details…</p>
              </div>
            )}

            {/* ERROR STATE */}
            {formState === "error" && (
              <div role="alert" className="flex flex-col items-center gap-3 text-center">
                <XCircle size={44} strokeWidth={1.5} className="text-my-blue" />
                {responseMessage === "Your email is not verified" ? (
                  <>
                    <p className="text-xl font-semibold text-my-deep-blue">Email not verified</p>
                    <p className="text-sm leading-6 text-my-gray/70 sm:text-base">
                      Check your inbox for the verification link, or request a new one below.
                    </p>
                    <Link
                      href={`/resend-verification?email=${encodeURIComponent(userEmail)}`}
                      className={`${primaryButton} mt-3 block`}
                    >
                      Resend verification link
                    </Link>
                    <button type="button" onClick={setToIdle} className={`${textButton} mt-1`}>
                      Back to login
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-my-deep-blue">Couldn&apos;t log you in</p>
                    <p className="text-sm leading-6 text-my-gray/70 sm:text-base">{responseMessage}</p>
                    <button type="button" onClick={setToIdle} className={`${primaryButton} mt-3`}>
                      Try again
                    </button>
                  </>
                )}
              </div>
            )}

            {/* SUCCESS STATE */}
            {formState === "success" && <InProgress message="Logging in" />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;