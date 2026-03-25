import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeClosed } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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

type Props = {
  goToLogin: () => void
}

const SignUp = ({ goToLogin }: Props) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <div>
      <Formik
        initialValues={{ fullName: "", email: "", password: "", phone: "", company: "", referralCode: "" }}
        validationSchema={signUpSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {

          try {
            const response = await fetch("/api/lead", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });


            const result = await response.json();

            if (result.success) {

              resetForm();
            } else {

            }
          } catch (err) {
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
                Create Account
              </button>
              <p className="mt-2 text-center">Already have an account? <span onClick={goToLogin} className="text-my-blue cursor-pointer">Log in</span></p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignUp