"use client"

import { Field, ErrorMessage, FieldArray } from "formik"
import { useRef } from "react"
import Image from "next/image"

interface Director {
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

interface StepTwoProps {
    values: { directors: Director[] }
    setFieldValue: (field: string, value: any) => void
}

const StepTwoUBO = ({ values, setFieldValue }: StepTwoProps) => {
    // single object for refs
    const fileRefs = useRef<{
        [key: string]: HTMLInputElement[]
    }>({
        idFront: [],
        idBack: [],
        proofOfAddressDoc: [],
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Director) => {
        const file = e.target.files?.[0]
        console.log("Selected file for", field, ":", file)
        if (file) setFieldValue(`directors[${index}].${field}`, file)
    }

    return (
        <FieldArray name="directors">
            {({ push, remove }) => (
                <div className="space-y-6">
                    {values.directors.map((director, index) => (
                        <div key={index} className="outline outline-dashed outline-my-blue/15 rounded-xl p-4 space-y-4">
                            <h4 className="font-medium text-my-deep-blue">
                                {index === 0 && "First Director and UBO"}
                                {index === 1 && "Second Director"}
                                </h4>

                            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
                                {/* Full Name */}
                                <div className="col-span-2">
                                    <label className="text-my-gray/85 text-[15px]">Full Name</label>
                                    <Field
                                        name={`directors[${index}].fullName`}
                                        placeholder="John Doe"
                                        className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
                                    />
                                    <ErrorMessage
                                        name={`directors[${index}].fullName`}
                                        component="p"
                                        className="text-sm text-red-400 mt-1"
                                    />
                                </div>

                                <div className="col-span-2">
                                        <label className="text-my-gray/85 text-[15px]">Address</label>
                                        <Field
                                            name={`directors[${index}].address`}
                                            placeholder="Stress address"
                                            className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
                                        />
                                        <ErrorMessage
                                            name={`directors[${index}].address`}
                                            component="p"
                                            className="text-sm text-red-400 mt-1"
                                        />
                                    </div>
                                {[
                                    { label: "Country", name: "country", placeholder: "Country" },
                                    { label: "State", name: "state", placeholder: "State" },
                                    { label: "City", name: "city", placeholder: "City" },
                                    { label: "ID Number", name: "idNumber", placeholder: "ID Number" },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className="text-my-gray/85 text-[15px]">{field.label}</label>
                                        <Field
                                            name={`directors[${index}].${field.name}`}
                                            placeholder={field.placeholder}
                                            className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
                                        />
                                        <ErrorMessage
                                            name={`directors[${index}].${field.name}`}
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
                                        name={`directors[${index}].idType`}
                                        className="mt-1 w-full rounded-xl outline outline-my-blue/15 px-4 py-2 text-my-gray/85"
                                    >
                                        <option value="">Select ID</option>
                                        <option value="PASSPORT">Passport</option>
                                        <option value="DRIVERS_LICENSE">Driver's License</option>
                                        <option value="NATIONAL_ID">National ID</option>
                                    </Field>
                                    <ErrorMessage
                                        name={`directors[${index}].idType`}
                                        component="p"
                                        className="text-sm text-red-400 mt-1"
                                    />
                                </div>

                                {/* File Uploads */}
                                {(["idFront", "idBack", "proofOfAddressDoc"] as (keyof Director)[]).map(field => (
                                    <div key={field}>
                                        <label className="text-my-gray/85 text-[15px]">
                                            {field === "idFront" ? "ID Front" : field === "idBack" ? "ID Back" : "Proof of Address"}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            ref={el => {
                                                if (!fileRefs.current[field][index]) fileRefs.current[field][index] = el!
                                            }}
                                            onChange={e => handleFileChange(e, index, field)}
                                        />
                                        <div
                                            onClick={() => fileRefs.current[field][index]?.click()}
                                            className="mt-1 cursor-pointer border-2 border-dashed border-my-blue/20 hover:border-my-blue/50 p-6 text-center rounded-xl"
                                        >
                                              <Image
                                                        src="/images/upload.png"
                                                        alt="ID Back Icon"
                                                        width={40}
                                                        height={40}
                                                        className="mx-auto mb-2"
                                                      />
                                            <p className="font-medium">{director[field] instanceof File
                                                ? `✓ ${director[field].name}`
                                                : "Click to upload"}
                                            </p>
                                            {!director[field] && <p className="text-sm text-my-gray/50">PNG, JPG up to 10MB</p>}
                                        </div>
                                        <ErrorMessage
                                            name={`directors[${index}].${field}`}
                                            component="p"
                                            className="text-sm text-red-400 mt-1"
                                        />
                                    </div>
                                ))}

                                {/* Proof of Address Type */}
                                <div className="col-span-2">
                                    <label className="text-my-gray/85 text-[15px]">Proof of Address Type</label>
                                    <Field
                                        as="select"
                                        name={`directors[${index}].proofOfAddressType`}
                                        className="mt-1 w-full rounded-xl outline outline-my-blue/15 px-4 py-2"
                                    >
                                        <option value="">Select type</option>
                                        <option value="UTILITY_BILL">Utility Bill</option>
                                        <option value="BANK_STATEMENT">Bank Statement</option>
                                    </Field>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                {values.directors.length > 1 && (
                                    <button type="button" className="text-red-500 cursor-pointer" onClick={() => remove(index)}>Remove</button>
                                )}
                                 {values.directors.length < 2 && (
                                <button
                                    type="button"
                                    className="text-my-blue cursor-pointer"
                                    onClick={() =>
                        
                                        push({
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
                                        })
                                    }
                                >
                                    Add Director
                                </button>
                                 )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </FieldArray>
    )
}

export default StepTwoUBO