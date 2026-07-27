"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import SuccessResponse from "@/components/SuccessResponse";
import ErrorResponse from "@/components/ErrorResponse";


type InvestorFormValues = {
    name: string;
    email: string;
    accountType: "INDIVIDUAL" | "ENTERPRISE";
    kycStatus: "UNVERIFIED" | "PENDING" | "VERIFIED";
};


type Props = {
    refreshUsers?: () => void;
    onClose?: () => void;
};


const initialValues: InvestorFormValues = {
    name: "",
    email: "",
    accountType: "INDIVIDUAL",
    kycStatus: "UNVERIFIED",
};


const validationSchema = Yup.object({

    name: Yup.string()
        .required("Full name is required"),

    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

    accountType: Yup.string()
        .required("Account type is required"),

    kycStatus: Yup.string()
        .required("KYC status is required"),

});


export default function CreateInvestorForm({
    refreshUsers,
    onClose,
}: Props) {


    const [state, setState] =
        useState<
            "idle" |
            "loading" |
            "success" |
            "error"
        >("idle");


    const [message, setMessage] =
        useState("");



    async function createInvestor(
        values: InvestorFormValues,
        resetForm: () => void
    ) {


        setState("loading");


        try {


            const res = await fetchWithAuth(
                "/api/admin/users/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(values)
                }
            );



            const data = await res.json();



            if (!res.ok) {

                throw new Error(
                    data.error ||
                    "Failed creating account"
                );

            }



            setMessage(
                data.message ||
                "Client account created successfully"
            );


            setState("success");


            resetForm();

            refreshUsers?.();



        }
        catch (err: any) {

            setMessage(
                err.message ||
                "Something went wrong"
            );

            setState("error");

        }


    }




    return (

        <div className="
            rounded-xl
            bg-white
            p-6
        ">


            <div className="
                flex
                justify-between
                items-center
                mb-6
            ">

                <div>

                    <h3 className="
                    text-lg
                    font-bold
                    text-my-deep-blue
                    ">
                        Create Client Account
                    </h3>


                </div>



                {
                    onClose &&
                    <button
                        onClick={onClose}
                        className="
                    text-sm
                    text-my-gray
                    "
                    >
                        Close
                    </button>
                }


            </div>





            {
                state === "idle" &&

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) =>
                        createInvestor(
                            values,
                            resetForm
                        )
                    }
                >

                    {({ isSubmitting }) => (


                        <Form className="space-y-5">



                            <div>

                                <label className="
                            block
                            text-sm
                            mb-2
                            ">
                                    Full Name
                                </label>


                                <Field
                                    name="name"
                                    placeholder="John Doe"
                                    className="
                                w-full
                                rounded-lg
                                p-3
                                outline
                                outline-my-gray/20
                                focus:outline-my-deep-blue
                                transition-colors
                                duration-300                                
                                "
                                />


                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="
                                text-red-500
                                text-sm
                                mt-1
                                "
                                />


                            </div>




                            <div>

                                <label className="
                            block
                            text-sm
                            mb-2
                            ">
                                    Email Address
                                </label>


                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="investor@email.com"
                                    className="
                                w-full
                                rounded-lg
                                p-3
                                outline
                                outline-my-gray/20
                                focus:outline-my-deep-blue
                                transition-colors
                                duration-300                                
                                "
                                />


                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="
                                text-red-500
                                text-sm
                                mt-1
                                "
                                />


                            </div>




                            <div>

                                <label className="
                            block
                            text-sm
                            mb-2
                            ">
                                    Account Type
                                </label>


                                <Field
                                    as="select"
                                    name="accountType"
                                    className="
                                w-full
                                rounded-lg
                                p-3
                                outline
                                outline-my-gray/20
                                focus:outline-my-deep-blue
                                transition-colors
                                duration-300                                
                                "
                                >

                                    <option value="INDIVIDUAL">
                                        Individual Investor
                                    </option>


                                    <option value="ENTERPRISE">
                                        Enterprise Account
                                    </option>


                                </Field>


                            </div>


                            <div>

                                <label className="
block
text-sm
mb-2
">
                                    KYC Status
                                </label>


                                <Field
                                    as="select"
                                    name="kycStatus"
                                    className="
    w-full
    rounded-lg
    p-3
    outline
    outline-my-gray/20
    focus:outline-my-deep-blue
    transition-colors
    duration-300                                
    "
                                >

                                    <option value="UNVERIFIED">
                                        Unverified
                                    </option>


                                    <option value="PENDING">
                                        Pending Review
                                    </option>


                                    <option value="VERIFIED">
                                        Verified
                                    </option>


                                </Field>


                                <ErrorMessage
                                    name="kycStatus"
                                    component="p"
                                    className="
    text-red-500
    text-sm
    mt-1
    "
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                        rounded-lg
                        bg-my-blue
                        px-6
                        py-3
                        text-white
                        hover:bg-my-deep-blue
                        disabled:opacity-50
                        transition-colors
                        duration-300
                        cursor-pointer
                        "
                            >

                                {
                                    isSubmitting
                                        ?
                                        "Creating..."
                                        :
                                        "Create Client"
                                }


                            </button>




                        </Form>

                    )}

                </Formik>

            }




            {
                state === "loading" &&
                <InProgress
                    message="Creating client account"
                />
            }




            {
                state === "success" &&
                <SuccessResponse
                    message={message}
                />
            }




            {
                state === "error" &&
                <ErrorResponse
                    message={message}
                />
            }



        </div>

    );
}