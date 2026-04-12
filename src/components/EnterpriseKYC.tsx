"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from "formik"

import StepOneEnterprise from './StepOneE';
import StepTwoUBO from './StepTwoE';
import StepThreeOperator from './StepThreeE';
import StepFourReview from './StepFourE';
import { fetchWithAuth } from '@/utils/fetchWithAuth';


const stepOneSchema = Yup.object({
    companyName: Yup.string().required("Company Name is required"),
    certificateOfIncorporation: Yup.mixed().required("Certificate of Incorporation is required"),
    memorandumOfAssociation: Yup.mixed().required("Memorandum of Association is required"),
})

const directorSchema = Yup.object({
    directors: Yup.array().of(
        Yup.object({
            fullName: Yup.string().required("Full name required"),
            address: Yup.string().required("Director's address required"),
            country: Yup.string().required("Director's country required"),
            state: Yup.string().required("Director's state required"),
            city: Yup.string().required("Director's city required"),
            idType: Yup.string().required("Director's ID type required"),
            idNumber: Yup.string().required("Director's ID number required"),
            idFront: Yup.mixed().required("Director's ID front required"),
            idBack: Yup.mixed().required("Director's ID back required"),
            proofOfAddressType: Yup.string().required("Proof of address type required"),
            proofOfAddressDoc: Yup.mixed().required("Proof of address document required"),
        })
    ).min(1, "At least one director required")
})

const operatorSchema = Yup.object({
    fullName: Yup.string().required("Full name required"),
    address: Yup.string().required("Operator's address required"),
    country: Yup.string().required("Operator's country required"),
    state: Yup.string().required("Operator's state required"),
    city: Yup.string().required("Operator's city required"),
    idType: Yup.string().required("Operator's ID type required"),
    idNumber: Yup.string().required("Operator's ID number required"),
    idFront: Yup.mixed().required("Operator's ID front required"),
    idBack: Yup.mixed().required("Operator's ID back required"),
    proofOfAddressType: Yup.string().required("Proof of address type required"),
    proofOfAddressDoc: Yup.mixed().required("Proof of address document required"),
})

const EnterpriseKYC = () => {

    async function submitEnterpriseKYC(values: any) {
        const formData = new FormData()

        formData.append("companyName", values.companyName)
      
        if (values.certificateOfIncorporation) {
          formData.append(
            "certificateOfIncorporation",
            values.certificateOfIncorporation
          )
        }
      
        if (values.memorandumOfAssociation) {
          formData.append(
            "memorandumOfAssociation",
            values.memorandumOfAssociation
          )
        }
      
        formData.append(
          "directors",
          JSON.stringify(
            values.directors.map((d: any) => ({
              fullName: d.fullName,
              address: d.address,
              country: d.country,
              state: d.state,
              city: d.city,
              idType: d.idType,
              idNumber: d.idNumber,
              proofOfAddressType: d.proofOfAddressType,
            }))
          )
        )

        values.directors.forEach((director: any, index: number) => {
            if (director.idFront) {
              formData.append(`director_${index}_idFront`, director.idFront)
            }
          
            if (director.idBack) {
              formData.append(`director_${index}_idBack`, director.idBack)
            }
          
            if (director.proofOfAddressDoc) {
              formData.append(`director_${index}_proofOfAddressDoc`, director.proofOfAddressDoc)
            }
          })
      
        formData.append(
          "operator",
          JSON.stringify({
            fullName: values.operator.fullName,
            address: values.operator.address,
            country: values.operator.country,
            state: values.operator.state,
            city: values.operator.city,
            idType: values.operator.idType,
            idNumber: values.operator.idNumber,
            proofOfAddressType: values.operator.proofOfAddressType,
          })
        )
      
        if (values.operator.idFront) {
            formData.append("operator_idFront", values.operator.idFront)
          }
          
          if (values.operator.idBack) {
            formData.append("operator_idBack", values.operator.idBack)
          }
          
          if (values.operator.proofOfAddressDoc) {
            formData.append("operator_proofOfAddressDoc", values.operator.proofOfAddressDoc)
          }

        await fetchWithAuth("/api/kyc/enterprise", {
          method: "POST",
          body: formData,
        })
      }

    const [step, setStep] = useState(1)

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const initialValues = {
        companyName: "",
        certificateOfIncorporation: null,
        memorandumOfAssociation: null,

        directors: [
            {
                fullName: "",
                address: "",
                country: "",
                state: "",
                city: "",
                idType: "",
                idNumber: "",
                idFront: null,
                idBack: null,
                proofOfAddressType: "",
                proofOfAddressDoc: null,
            }
        ],

        operator: {
            fullName: "",
            address: "",
            country: "",
            state: "",
            city: "",
            idType: "",
            idNumber: "",
            idFront: null,
            idBack: null,
            proofOfAddressType: "",
            proofOfAddressDoc: null,
        }
    }

    return (
        <section className='py-8 bg-my-white w-full min-h-screen flex justify-center'>
            <div className='max-w-6xl w-full mx-auto px-4'>
                <div className='bg-my-white rounded-3xl w-full max-w-3xl p-7 md:p-16 mx-auto shadow-xl shadow-my-gray/10'>
                    <div className="flex flex-col gap-6">
                        <div className="text-center flex flex-col gap-1">
                            <Link href="/">
                                <Image src="/images/memestructureslogo.png" alt="Logo" width={210} height={60} />
                            </Link>
                            <h2 className='text-2xl md:text-3xl text-my-deep-blue font-medium mt-1'>Enterprise KYC</h2>
                            <p className="text-lg">Complete your organization verification.</p>
                        </div>

                        <div className='grid grid-cols-4 gap-1.5 text-my-deep-blue/90'>
                            {["Company", "Directors", "Operator", "Review"].map((label, idx) => (
                                <div key={idx} className='flex flex-col gap-1.5'>
                                    <div className={`h-1 ${step > idx ? "bg-my-blue" : "bg-my-gray/10"} rounded-full`}></div>
                                    <p className='text-sm text-center'>{label}</p>
                                </div>
                            ))}
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={
                                step === 1 ? stepOneSchema :
                                    step === 2 ? directorSchema :
                                        step === 3 ? operatorSchema :
                                            null
                            }
                            onSubmit={(values) => {
                                console.log("Enterprise KYC Submission:", values)
                                submitEnterpriseKYC(values);
                            }}
                        >
                            {({ values, setFieldValue }) => (
                                <Form className="space-y-4">

                                    {step === 1 && <StepOneEnterprise values={values} setFieldValue={setFieldValue} />}
                                    {step === 2 && <StepTwoUBO values={values} setFieldValue={setFieldValue} />}
                                    {step === 3 && <StepThreeOperator values={values} setFieldValue={setFieldValue} />}
                                    {step === 4 && <StepFourReview values={values} />}

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

                                        {step < 4 ? (
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

export default EnterpriseKYC