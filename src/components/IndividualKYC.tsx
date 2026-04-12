import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from "formik"
import StepOneI from './StepOneI';
import StepTwoI from './StepTwoI';
import StepThreeI from './StepThreeI';
import { fetchWithAuth } from '@/utils/fetchWithAuth';


const stepOneSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Name is too short")
    .required("Name is required"),
  lastName: Yup.string()
    .min(2, "Name is too short")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  dob: Yup.string().required(),
  gender: Yup.string().required(),
});

const stepTwoSchema = Yup.object({
  idType: Yup.string().required("ID type is required"),

  idNumber: Yup.string().required("ID number is required"),

  idFront: Yup.mixed()
    .required("Front of ID is required"),

  idBack: Yup.mixed()
    .required("Back of ID is required"),

  selfieWithId: Yup.mixed()
    .required("Selfie with ID is required"),
});

const stepThreeSchema = Yup.object({
  country: Yup.string().required(),
  state: Yup.string().required(),
  city: Yup.string().required(),
  address: Yup.string().required(),

  residenceType: Yup.string().required("Proof of residence type is required"),
  residenceDoc: Yup.mixed().required("Proof of residence document is required")
});

const IndividualKYC = () => {

  async function submitKYC(values: any) {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {

      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, value as any)
      }

    })

    await fetchWithAuth("/api/kyc/individual", {
      method: "POST",
      body: formData
    })
  }

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <section className='py-8 bg-my-white w-full min-h-screen flex justify-center'>
      <div className='max-w-6xl w-full mx-auto px-4 bg-my-white'>
        <div className='bg-my-white rounded-3xl w-full max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10'>
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
              <h2 className='text-2xl md:text-3xl text-my-deep-blue font-medium mt-1'>KYC Verification</h2>
              <p className="text-lg">Enter your authentic details for verification.</p>
            </div>
            <div className='grid grid-cols-3 gap-1.5 text-my-deep-blue/90'>
              <div className='flex flex-col gap-1.5'>
                <div className={`h-1 bg-my-blue rounded-full`}></div>
                <p className='text-sm text-center'>Personal Info</p>
              </div>
              <div className='flex flex-col gap-1.5'>
                <div className={`h-1 ${step >= 2 ? "bg-my-blue" : "bg-my-gray/10"} rounded-full`}></div>
                <p className='text-center text-sm'>Identity</p>
              </div>
              <div className='flex flex-col gap-1.5'>
                <div className={`h-1 ${step >= 3 ? "bg-my-blue" : "bg-my-gray/10"} reunded-full`}></div>
                <p className='text-sm text-center'>Residence</p>
              </div>
            </div>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                dob: "",
                gender: "",
                email: "",
                phoneCode: "+234",
                phone: "",

                idType: "",
                idNumber: "",
                idFront: null,
                idBack: null,
                selfieWithId: null,

                country: "",
                state: "",
                city: "",
                residenceType: "",
                address: "",
                residenceDoc: null
              }}

              validationSchema={
                step === 1 ? stepOneSchema :
                  step === 2 ? stepTwoSchema :
                    stepThreeSchema
              }

              onSubmit={(values) => {
                console.log(values)
                submitKYC(values);
              }}
            >

              {({ setFieldValue, values }) => (
                <Form className="space-y-4">

                  {step === 1 && <StepOneI />}

                  {step === 2 && (
                    <StepTwoI values={values} setFieldValue={setFieldValue} />
                  )}

                  {step === 3 && (
                    <StepThreeI values={values} setFieldValue={setFieldValue} />
                  )}

                  <div className={`grid ${step === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4 pt-6`}>

                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="mt-2 w-full rounded-xl bg-gray-100 hover:cursor-pointer hover:bg-my-blue-white text-my-gray/70 py-3 font-medium hover:opacity-90 transition-all duration-300"
                      >
                        Back
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="mt-2 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="mt-2 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300"
                      >
                        Submit KYC
                      </button>
                    )}

                  </div>

                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IndividualKYC