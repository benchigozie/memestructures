"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeClosed, CircleCheckBig, XCircle, } from "lucide-react";
import { PuffLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";


const loginSchema = Yup.object({
  identifier: Yup.string()
    .required("Email or username is required"),
  password: Yup.string()
    .required("Password is required")
});


const page = () => {


  const [formState, setFormState] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [responseType, setResponseType] = useState<"generic" | "unverified" | null>(null);
  const [ userEmail, setUserEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const setToSubmitting = () => {
    setFormState("submitting");
  }

  const setToError = () => {
    setFormState("error");
  }

  const setToIdle = () => {
    setFormState("idle");
  }

  const setToSuccess = () => {
    setFormState("success");
  }

  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/user/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: responseMessage.split('"')[1] }),
      });

      const result = await response.json();

      if (result.success) {
        setToSuccess();

      } else {
        setResponseMessage("Failed to resend verification email. Please try again later.");
        setToError();
      }
    } catch (err) {
      setResponseMessage("An unexpected error occurred. Please try again.");
      setToError();
      console.error(err);
    }
  }

  return (
    <section className='bg-my-white py-14'>
      <div className="flex flex-col gap-3">
        <div className="text-center items-center flex flex-col gap-3">
          <Link href="/">
            <Image
              src="/images/memestructureslogo.png"
              alt="Meme Structures Logo"
              width={250}
              height={70}
            />
          </Link>
          <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Welcome Back</h2>
          <p className="text-lg">Login to your account to continue.</p>
        </div>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='bg-my-white rounded-3xl max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10 mt-10'>
            {formState === "idle" &&
              <Formik
                initialValues={{ identifier: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {

                  try {
                    const response = await fetch("/api/user/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });


                    const result = await response.json();
                    console.log("Login response ooooooooo:", result);
                    
                    if (result.error === "Your email is not verified") {
                    setUserEmail(result.user.email);
                    }

                    if (result.success) {
                      
                      resetForm();
                      // store access token in memory (state/context)
                      //setAccessToken(result.accessToken);

                      // redirect to dashboard
                      //router.push("/dashboard");

                      setToSuccess();
                      console.log("Login successful:", result);
                      console.log("redirecting to dashboard enshiii");
                    } else {
                      setFormState("error");
                      setResponseMessage(result.error);
                      console.error(result.error);
                      // show error to user
                    }

                  } catch (err) {
                    setResponseMessage("An unexpected error occurred. Please try again.");
                    setToError();
                    console.error("Login error:", err);
                    console.error(err);

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
                        <ErrorMessage
                          name="identifier"
                          component="p"
                          className="text-sm text-red-400 mt-1"
                        />
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

                      <div className="absolute left-2499.75">
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
                        Login
                      </button>
                      <p className="mt-2 text-center">Dont have an account? <span className="text-my-blue cursor-pointer"><Link href="/register">Create Account</Link></span></p>
                      <p className="mt-2 text-sm text-center text-my-gray/70">Forgot Password? <span className="text-my-blue/80 cursor-pointer"><Link href="/forgot-password">Reset</Link></span></p>
                    </div>
                  </Form>
                )}
              </Formik>
            }
            {
              formState === "submitting" && (<div className="flex flex-col gap-5 items-center py-15 px-10">
                <PuffLoader color="#006de2" size={60} className="mx-auto mt-5" />
                <p className="text-center text-xl">Submitting your information, please wait</p>
              </div>)
            }
            {
              formState === "error" && (<div className="flex flex-col gap-5 items-center py-15 px-10">
                {
                  responseMessage === "Your email is not verified" ?
                    <div>
                      <XCircle size={60} color="#006de2" className="mx-auto mt-5" />
                      <p className="text-center text-xl">{responseMessage}</p>
                      <p className="text-center">Check your email inbox for your verification link. You can also request for a new link by clicking below.</p>
                      <Link href={`/resend-verification?email=${userEmail}`} className="flex justify-center">
                        <div className="bg-my-blue text-sm md:text-base px-4 md:px-7 py-3 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer">
                          Resend
                        </div>
                      </Link>
                    </div>
                    :
                    <div>
                      <XCircle size={60} color="#006de2" className="mx-auto mt-5" />
                      <p className="text-center text-xl">{responseMessage}</p>
                      <button onClick={setToIdle} className="bg-my-blue text-sm md:text-base px-4 md:px-7 py-3 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer">Back to Form</button>
                    </div>
                }
              </div>)
            }
            {
              formState === "success" && (<div className="flex flex-col gap-5 items-center py-15 px-10">
                <PuffLoader color="#006de2" size={60} className="mx-auto mt-5" />
                <p className="text-center text-xl">Logging In</p>
              </div>)
            }

          </div>
        </div>
      </div>
    </section>
  )
}

export default page