import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeClosed } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const loginSchema = Yup.object({
  identifier: Yup.string()
    .required("Email or username is required"),
  password: Yup.string()
    .required("Password is required")
});

type Props = {
  goToSignup: () => void
}

const Login = ({ goToSignup }: Props) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const result = await res.json();
  
      if (result.success) {
        // store access token in memory (state/context)
        //setAccessToken(result.accessToken);
  
        // redirect to dashboard
        //router.push("/dashboard");
      } else {
        console.error(result.error);
        // show error to user
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ fullName: "", email: "", password: "", phone: "", company: "", referralCode: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {

          try {
            const response = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });


            const result = await response.json();

            if (result.success) {
              resetForm();
              // store access token in memory (state/context)
              //setAccessToken(result.accessToken);
        
              // redirect to dashboard
              //router.push("/dashboard");
            } else {
              console.error(result.error);
              // show error to user
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
                <label htmlFor="identifier" className="text-my-gray/85 text-[15px]">Enter Your Email or Username</label>
                <Field
                  name="identifier"
                  type="text"
                  id="identifier"
                  placeholder="Email or Username"
                  className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-sm text-red-400 mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-my-gray/85 text-[15px]">Enter Your Password</label>
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Login