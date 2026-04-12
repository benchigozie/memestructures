"use client"

import { Field, ErrorMessage } from "formik"
import { useRef } from "react"
import Image from "next/image"

interface StepOneProps {
  values: any
  setFieldValue: (field: string, value: any) => void
}

const StepOneEnterprise = ({ values, setFieldValue }: StepOneProps) => {
  const certRef = useRef<HTMLInputElement>(null)
  const memoRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) setFieldValue(field, file)
  }

  return (
    <div className="space-y-4 grid gap-x-4 md:grid-cols-2">
      <div className="col-span-2">
        <label className="text-my-gray/85 text-[15px]">Company Name</label>
        <Field
          name="companyName"
          placeholder="Enter company name"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />
        <ErrorMessage name="companyName" component="p" className="text-sm text-red-400 mt-1" />
      </div>


      <div className="col-span-2">
        <label className="text-my-gray/85 text-[15px]">Certificate of Incorporation</label>
        <input ref={certRef} type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "certificateOfIncorporation")} className="hidden" />
        <div onClick={() => certRef.current?.click()} className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center">
          <Image src="/images/upload.png" alt="Upload Icon" width={40} height={40} className="mx-auto mb-2" />
          {values.certificateOfIncorporation ? (
            <p className="font-medium">✓ {values.certificateOfIncorporation.name}</p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">Click to upload</p>
              <p className="text-sm text-my-gray/50">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>
        <ErrorMessage name="certificateOfIncorporation" component="p" className="text-sm text-red-400 mt-1" />
      </div>

      <div className="col-span-2">
        <label className="text-my-gray/85 text-[15px]">Memorandum of Association</label>
        <input ref={memoRef} type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "memorandumOfAssociation")} className="hidden" />
        <div onClick={() => memoRef.current?.click()} className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center">
          <Image src="/images/upload.png" alt="Upload Icon" width={40} height={40} className="mx-auto mb-2" />
          {values.memorandumOfAssociation ? (
            <p className="font-medium">✓ {values.memorandumOfAssociation.name}</p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">Click to upload</p>
              <p className="text-sm text-my-gray/50">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>
        <ErrorMessage name="memorandumOfAssociation" component="p" className="text-sm text-red-400 mt-1" />
      </div>

    </div>
  )
}

export default StepOneEnterprise