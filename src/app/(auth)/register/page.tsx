"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeClosed, CircleCheckBig, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


const signUpSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name is too short")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  referralCode: Yup.string()
    .optional(),
});

const page = () => {

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user]);

  const [formState, setFormState] = useState<"idle" | "submitting" | "response" | "success">("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const setToSubmitting = () => {
    setFormState("submitting");
  }

  const setToResponse = () => {
    setFormState("response");
  }

  const setToIdle = () => {
    setFormState("idle");
  }

  const setToSuccess = () => {
    setFormState("success");
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
              <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1'>Create Your Account</h2>
              <p className="text-lg">Create your profile to get started.</p>
            </div>
            {formState === "idle" && <Formik
              initialValues={{ fullName: "", email: "", password: "", phone: "", company: "", referralCode: "" }}
              validationSchema={signUpSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {

                setToSubmitting();

                try {
                  const response = await fetch("/api/user/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  });

                  const result = await response.json();

                  if (result.success) {
                    resetForm();

                    console.log("Signup successful:", result);
                    setToSuccess();
                  } else {
                    setToResponse();
                    console.error(result.error);
                    setResponseMessage(result.error);
                    // show error to user
                  }
                } catch (err) {
                  console.error(err);
                  setToResponse();
                  setResponseMessage("An unexpected error occurred. Please try again later.");
                } finally {
                  setSubmitting(false);
                }

              }}
            >
              {({ isSubmitting }) => (
                <div>
                  <Form>
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="fullName" className="text-my-gray/85 text-[15px]">Your Full Name</label>
                        <Field
                          name="fullName"
                          placeholder="John Davis"
                          id="fullName"
                          autoComplete="name"
                          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                        />
                        <ErrorMessage
                          name="fullName"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="text-my-gray/85 text-[15px]">Enter Your Email</label>
                        <Field
                          name="email"
                          type="email"
                          id="email"
                          placeholder="john@examplemail.com"
                          autoComplete="email"
                          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="text-my-gray/85 text-[15px]">Choose Your Password</label>
                        <div className="mt-1 rounded-xl outline outline-my-blue/15 focus-within:outline-my-blue/40 flex justify-between items-center">
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
                                <motion.div
                                  key="eye"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <Eye size={21} stroke="#A0A3AB" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="eyeClosed"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <EyeClosed size={21} stroke="#A0A3AB" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-my-gray/85 text-[15px]">Enter Your Phone Number</label>
                        <Field
                          name="phone"
                          placeholder="Phone"
                          autoComplete="tel"
                          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="referralCode" className="text-my-gray/85 text-[15px]">Referral Code (Optional)</label>
                        <Field
                          name="referralCode"
                          placeholder="Enter Code"
                          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                        />
                        <ErrorMessage
                          name="referralCode"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
                      </div>
                      <div className="sr-only">
                        <Field
                          type="text"
                          name="company"
                          placeholder="Company Name"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                      >
                        Create Account
                      </button>
                      <p className="mt-2 text-center">Already have an account? <span className="text-my-blue cursor-pointer"><Link href="/login">Log in</Link></span></p>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>}
            {
              formState === "submitting" && (<div className="flex flex-col gap-5 items-center py-8 px-10">
                <PuffLoader color="#006de2" size={60} className="mx-auto" />
                <p className="text-center text-xl">Submitting your information, please wait</p>
              </div>)
            }
            {
              formState === "response" && (<div className="flex flex-col gap-5 items-center py-4 px-10">
                <XCircle size={60} color="#006de2" className="mx-auto" />
                <p className="text-center text-xl">{responseMessage}</p>
                <button onClick={setToIdle} className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
              </div>)
            }
            {
              formState === "success" && (<div className="flex flex-col gap-5 items-center py-4 px-10">
                <CircleCheckBig size={60} color="#006de2" className="mx-auto" />
                <p className="text-center text-xl">Your account has been created successfully! Check your Email for your verification link.</p>
                <button onClick={setToIdle} className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
              </div>)
            }
          </div>
        </div>

      </div>
    </section>
  )
}

export default page