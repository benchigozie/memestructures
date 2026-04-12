"use client"

import { Field, ErrorMessage } from "formik"
import { useRef } from "react"
import Image from "next/image"

interface StepThreeProps {
  values: any
  setFieldValue: (field: string, value: any) => void
}

interface Operator {
  fullName: string
  address: string
  country: string
  state: string
  city: string
  idType: string
  idNumber: string
  idFront: File | null
  idBack: File | null
  proofOfAddressType: string
  proofOfAddressDoc: File | null
}

const fileArray = [
  { "name": "idFront", "ref": "" }, "idBack", "proofOfAddressDoc"
]

const StepThreeOperator = ({ values, setFieldValue }: StepThreeProps) => {
  const idFrontRef = useRef<HTMLInputElement>(null)
  const idBackRef = useRef<HTMLInputElement>(null)
  const proofRef = useRef<HTMLInputElement>(null)

  const fileArray = [
    { "name": "idFront", "ref": idFrontRef }, { "name": "idBack", "ref": idBackRef }, { "name": "proofOfAddressDoc", "ref": proofRef }
  ]


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    setFieldValue(`operator.${field}`, file)
  }

  return (
    <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">

      <div className="col-span-2">
        <label className="text-my-gray/85 text-[15px]">Full Name</label>
        <Field
          name="operator.fullName"
          placeholder="John Doe"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />
        <ErrorMessage
          name="operator.fullName"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* Other text fields */}
      {[
        { label: "Address", name: "address", placeholder: "Street address" },
        { label: "Country", name: "country", placeholder: "Country" },
        { label: "State", name: "state", placeholder: "State" },
        { label: "City", name: "city", placeholder: "City" },
        { label: "ID Number", name: "idNumber", placeholder: "ID Number" },
      ].map(field => (
        <div key={field.name}>
          <label className="text-my-gray/85 text-[15px]">{field.label}</label>
          <Field
            name={`operator.${field.name}`}
            placeholder={field.placeholder}
            className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
          />
          <ErrorMessage
            name={`operator.${field.name}`}
            component="p"
            className="text-sm text-red-400 mt-1"
          />
        </div>
      ))}

      {/* ID Type */}
      <div>
        <label className="text-my-gray/85 text-[15px]">ID Type</label>
        <Field
          as="select"
          name={`operator.idType`}
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 px-4 py-2 text-my-gray/80"
        >
          <option value="">Select ID</option>
          <option value="PASSPORT">Passport</option>
          <option value="DRIVERS_LICENSE">Driver's License</option>
          <option value="NATIONAL_ID">National ID</option>
        </Field>
        <ErrorMessage
          name={`operator.idType`}
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* File Uploads */}
      {fileArray.map((field, index) => (
          <div key={index}>
            <label className="text-my-gray/85 text-[15px]">
              {field.name === "idFront" ? "ID Front" : field.name === "idBack" ? "ID Back" : "Proof of Address"}
            </label>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={field.ref}
              onChange={e => handleFileChange(e, field.name)}
            />
            <div
              onClick={() => field.ref.current?.click()}
              className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 p-6 text-center rounded-xl"
            >
              <Image
                src="/images/upload.png"
                alt="ID Back Icon"
                width={40}
                height={40}
                className="mx-auto mb-2"
              />
              <p className="font-medium">
                {values.operator?.[field.name] instanceof File
                  ? `✓ ${values.operator[field.name].name}`
                  : "Click to upload"}
              </p>
              {values.operator?.[field.name] instanceof File ? "" : <p className="text-sm text-my-gray/50">PNG, JPG up to 10MB</p> }
            </div>
            <ErrorMessage
              name={field.name}
              component="p"
              className="text-sm text-red-400 mt-1"
            />
          </div>
        )
      )}

      {/* Proof of Address Type */}
      <div>
        <label className="text-my-gray/85 text-[15px]">Proof of Address Type</label>
        <Field
          as="select"
          name="operator.proofOfAddressType"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 px-4 py-2"
        >
          <option value="">Select type</option>
          <option value="UTILITY_BILL">Utility Bill</option>
          <option value="BANK_STATEMENT">Bank Statement</option>
        </Field>
        <ErrorMessage
          name="operator.proofOfAddressType"
          component="p"
          className="text-sm text-red-400 mt-1" />
      </div>
    </div>
  )
}

export default StepThreeOperator