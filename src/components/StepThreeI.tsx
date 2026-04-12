"use client"

import { useRef } from "react"
import { FormikErrors, Field, ErrorMessage } from "formik"
import Image from "next/image"

interface StepThreeProps {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>

  values: {
    residenceDoc: File | null
  }
}

const StepThreeI = ({ setFieldValue, values }: StepThreeProps) => {

  const residenceRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.currentTarget.files?.[0]

    if (file) {
      setFieldValue(field, file)
    }
  }

  return (
    <div className="space-y-3 grid gap-x-4 md:grid-cols-2">

      <div className="col-span-2">
        <label htmlFor="country" className="text-my-gray/85 text-[15px]">
          Country
        </label>

        <Field
          name="country"
          id="country"
          placeholder="Enter your country"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
        />

        <ErrorMessage
          name="country"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label htmlFor="state" className="text-my-gray/85 text-[15px]">
          State
        </label>

        <Field
          name="state"
          id="state"
          placeholder="Enter state"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
        />

        <ErrorMessage
          name="state"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label htmlFor="city" className="text-my-gray/85 text-[15px]">
          City
        </label>

        <Field
          name="city"
          id="city"
          placeholder="Enter city"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
        />

        <ErrorMessage
          name="city"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div className="col-span-2">
        <label htmlFor="address" className="text-my-gray/85 text-[15px]">
          Address
        </label>

        <Field
          name="address"
          id="address"
          placeholder="Enter full address"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
        />

        <ErrorMessage
          name="address"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* Residence Upload */}

      <div className="col-span-2">
  <label htmlFor="residenceType" className="text-my-gray/85 text-[15px]">
    Proof of Residence Type
  </label>

  <Field
    as="select"
    name="residenceType"
    id="residenceType"
    className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
  >
    <option value="">Select document type</option>
    <option value="utility_bill">Utility Bill</option>
    <option value="bank_statement">Bank Statement</option>
    <option value="tenancy_agreement">Tenancy Agreement</option>
    <option value="government_letter">Government Letter</option>
  </Field>

  <ErrorMessage
    name="residenceType"
    component="p"
    className="text-sm text-red-400 mt-1"
  />
</div>

      <div className="col-span-2">
        <label className="text-my-gray/85 text-[15px]">
          Upload Proof of Residence
        </label>

        <input
          ref={residenceRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "residenceDoc")}
          className="hidden"
        />

        <div
          onClick={() => residenceRef.current?.click()}
          className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center transition"
        >
          <div>
            <Image
              src="/images/upload.png"
              alt="Residence Upload Icon"
              width={40}
              height={40}
              className="mx-auto mb-2"
            />
          </div>

          {values.residenceDoc ? (
            <p className="font-medium">
              ✓ {values.residenceDoc.name}
            </p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">
                Click to upload
              </p>
              <p className="text-sm text-my-gray/50">
                Utility bill, bank statement, etc
              </p>
            </>
          )}
        </div>

        <ErrorMessage
          name="residenceDoc"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

    </div>
  )
}

export default StepThreeI