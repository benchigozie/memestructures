"use client"

import { useRef } from "react"
import { FormikErrors, Field, ErrorMessage } from "formik"
import Image from "next/image"

interface StepTwoProps {
  values: {
    idFront: File | null
    idBack: File | null
    selfieWithId: File | null
  },

  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>
}

const StepTwo = ({ setFieldValue, values }: StepTwoProps) => {

  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

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

      {/* ID TYPE */}

      <div className="col-span-2">
        <label htmlFor="idType" className="text-my-gray/85 text-[15px]">
          Select ID Type
        </label>

        <Field
          as="select"
          name="idType"
          id="idType"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85 bg-white"
        >
          <option value="">Choose ID</option>
          <option value="PASSPORT">Passport</option>
          <option value="DRIVERS_LICENSE">Driver's License</option>
          <option value="NATIONAL_ID">National ID</option>
        </Field>

        <ErrorMessage
          name="idType"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* ID NUMBER */}

      <div className="col-span-2">
        <label htmlFor="idNumber" className="text-my-gray/85 text-[15px]">
          ID Number
        </label>

        <Field
          name="idNumber"
          id="idNumber"
          placeholder="Enter your ID number"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2 text-my-gray/85"
        />

        <ErrorMessage
          name="idNumber"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* ID FRONT */}

      <div>
        <label className="text-my-gray/85 text-[15px]">
          Upload ID Front
        </label>

        <input
          ref={frontRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "idFront")}
          className="hidden"
        />

        <div
          onClick={() => frontRef.current?.click()}
          className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center transition"
        >
          <Image
            src="/images/upload.png"
            alt="ID Front Icon"
            width={40}
            height={40}
            className="mx-auto mb-2"
          />

          {values.idFront ? (
            <p className="font-medium">
              ✓ {values.idFront.name}
            </p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">
                Click to upload
              </p>
              <p className="text-sm text-my-gray/50">
                PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>

        <ErrorMessage
          name="idFront"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label className="text-my-gray/85 text-[15px]">
          Upload ID Back
        </label>

        <input
          ref={backRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "idBack")}
          className="hidden"
        />

        <div
          onClick={() => backRef.current?.click()}
          className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center transition"
        >
          <Image
            src="/images/upload.png"
            alt="ID Back Icon"
            width={40}
            height={40}
            className="mx-auto mb-2"
          />

          {values.idBack ? (
            <p className="font-medium">
              ✓ {values.idBack.name}
            </p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">
                Click to upload
              </p>
              <p className="text-sm text-my-gray/50">
                PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>

        <ErrorMessage
          name="idBack"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>
      {/* SELFIE WITH ID */}

      <div className="md:col-span-2">
        <label className="text-my-gray/85 text-[15px]">
          Upload Selfie With ID
        </label>

        <input
          ref={selfieRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "selfieWithId")}
          className="hidden"
        />

        <div
          onClick={() => selfieRef.current?.click()}
          className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 rounded-xl p-10 text-center transition"
        >
          <Image
            src="/images/upload.png"
            alt="Selfie Upload Icon"
            width={40}
            height={40}
            className="mx-auto mb-2"
          />

          {values.selfieWithId ? (
            <p className="font-medium">
              ✓ {values.selfieWithId.name}
            </p>
          ) : (
            <>
              <p className="text-my-gray/80 font-medium">
                Click to upload
              </p>
              <p className="text-sm text-my-gray/50">
                PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>

        <ErrorMessage
          name="selfieWithId"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

    </div>
  )
}

export default StepTwo