"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { wallets } from "@/data/wallets";
import { useRef, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "./InProgress";
import ErrorResponse from "./ErrorResponse";
import SuccessResponse from "./SuccessResponse";

type InvestmentFormValues = {
    amount: string;
    coin: string;
    network: string;
    proof: File | null;
};



type AssetInvestmentProps = {
    asset: any;
    validationSchema: any;
};



const AssetInvestment = ({
    asset,
    validationSchema,
}: AssetInvestmentProps) => {


    console.log("AssetInvestment component rendered with asset:", asset);


    const [formState, setFormState] = useState<
        "idle" | "submitting" | "error" | "success"
    >("idle");


    const [responseMessage, setResponseMessage] = useState("");

    const proofRef = useRef<HTMLInputElement>(null);



    async function submitInvestment(
        values: InvestmentFormValues
    ) {

        setFormState("submitting");


        const formData = new FormData();


        formData.append(
            "amount",
            values.amount
        );


        formData.append(
            "coin",
            values.coin
        );


        formData.append(
            "network",
            values.network
        );


        formData.append(
            "assetClassSlug",
            asset.slug
        );



        if(values.proof){

            formData.append(
                "proof",
                values.proof
            );

        }



        try {

            const res = await fetchWithAuth(
                "/api/investment/direct",
                {
                    method: "POST",
                    body: formData,
                }
            );


            const data = await res.json();



            if(data.success){

                setFormState("success");

                setResponseMessage(
                    data.message ||
                    "Investment submitted successfully!"
                );

            } else {

                setFormState("error");

                setResponseMessage(
                    data.error ||
                    "Something went wrong"
                );

            }



        } catch(error){

            console.error(error);

            setFormState("error");

            setResponseMessage(
                "Unexpected error occurred"
            );

        }

    }





    return (

        <div className="p-4 md:p-10">

            <div className="
                bg-white
                rounded-lg
                shadow-md
                p-6
                md:p-8
                border
                border-gray-100
                max-w-xl
            ">


                <section className="flex flex-col gap-4 mb-6">

                    <h1 className="
                        text-2xl
                        text-center
                        md:text-3xl
                        text-my-deep-blue
                        font-bold
                    ">
                        Invest in {asset.name}
                    </h1>


                    <p className="text-gray-600 text-[17px]">
                        {asset.description}
                    </p>


                </section>




                <section>

                    <h2 className="
                        text-xl
                        font-semibold
                        text-my-deep-blue
                        mb-4
                    ">
                        Investment Overview
                    </h2>


                    {
                        formState === "idle" && (

                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                            ">


                                <div>

                                    <span className="text-xs">
                                        MIN INVESTMENT
                                    </span>

                                    <p className="font-medium text-my-deep-blue">
                                        ₦{asset.minimumInvestment.toLocaleString()}
                                    </p>

                                </div>



                                <div>

                                    <span className="text-xs">
                                        MAX INVESTMENT
                                    </span>

                                    <p className="font-medium text-my-deep-blue">

                                        {
                                            asset.maximumInvestment
                                            ? `₦${asset.maximumInvestment.toLocaleString()}`
                                            : "Unlimited"
                                        }

                                    </p>

                                </div>



                                <div>

                                    <span className="text-xs">
                                        LOCK-UP PERIOD
                                    </span>

                                    <p className="font-medium text-my-deep-blue">
                                        {asset.lockupPeriod || "N/A"}
                                    </p>

                                </div>



                                <div>

                                    <span className="text-xs">
                                        TARGET RETURN
                                    </span>

                                    <p className="font-medium text-my-deep-blue">
                                        {asset.targetReturn || "N/A"}
                                    </p>

                                </div>



                            </div>

                        )
                    }

                </section>





                <section className="mt-4">


                {
                    formState === "idle" && (

                    <Formik<InvestmentFormValues>

                        initialValues={{
                            amount: "",
                            coin: "",
                            network: "",
                            proof: null
                        }}


                        validationSchema={validationSchema}


                        onSubmit={(values)=>submitInvestment(values)}

                    >

                    {({
                        isValid,
                        dirty,
                        values,
                        setFieldValue
                    })=>{


                        const amount =
                            Number(values.amount) || 0;


                        const fee =
                            amount * 0.01;


                        const total =
                            amount + fee;



                        const selectedWallet =
                            wallets.find(
                                w=>w.coin === values.coin
                            );



                        const selectedNetwork =
                            selectedWallet?.networks.find(
                                n=>n.name === values.network
                            );



                        return (

                        <Form className="mt-4">


                            <label className="
                                text-sm
                                text-my-deep-blue
                                font-medium
                            ">
                                Investment Amount (NGN)
                            </label>


                            <Field
                                name="amount"
                                type="number"
                                placeholder={`Min ₦${asset.minimumInvestment.toLocaleString()}`}
                                className="
                                    w-full
                                    outline
                                    outline-my-gray/40
                                    focus:outline-my-deep-blue
                                    rounded-lg
                                    px-4
                                    py-3
                                    mt-2
                                "
                            />


                            <ErrorMessage
                                name="amount"
                                component="p"
                                className="text-red-500 text-sm mt-2"
                            />



                            {
                                amount > 0 && (

                                <div className="mt-4 text-sm">

                                    <p>
                                        1% subscription fee:
                                        <span className="font-medium text-my-deep-blue">
                                            ₦{fee.toLocaleString()}
                                        </span>
                                    </p>


                                    <p>
                                        Total:
                                        <span className="font-medium text-my-deep-blue">
                                            ₦{total.toLocaleString()}
                                        </span>
                                    </p>

                                </div>

                                )
                            }





                            <div className="grid md:grid-cols-2 gap-4 mt-4">


                                <div>

                                    <label className="text-sm font-medium text-my-deep-blue">
                                        Select Coin
                                    </label>


                                    <Field
                                        as="select"
                                        name="coin"
                                        className="
                                            w-full
                                            mt-2
                                            px-4
                                            py-3
                                            rounded-lg
                                            border
                                        "
                                    >

                                        <option value="">
                                            Select coin
                                        </option>


                                        {
                                            wallets.map(w=>(
                                                <option
                                                    key={w.coin}
                                                    value={w.coin}
                                                >
                                                    {w.coin}
                                                </option>
                                            ))
                                        }


                                    </Field>


                                </div>




                                <div>

                                    <label className="text-sm font-medium text-my-deep-blue">
                                        Select Network
                                    </label>


                                    <Field
                                        as="select"
                                        name="network"
                                        disabled={!values.coin}
                                        className="
                                            w-full
                                            mt-2
                                            px-4
                                            py-3
                                            rounded-lg
                                            border
                                        "
                                    >

                                        <option value="">
                                            Select network
                                        </option>


                                        {
                                            selectedWallet?.networks.map(n=>(
                                                <option
                                                    key={n.name}
                                                    value={n.name}
                                                >
                                                    {n.name}
                                                </option>
                                            ))
                                        }


                                    </Field>


                                </div>


                            </div>





                            {
                                selectedNetwork && (

                                <div className="
                                    mt-4
                                    p-3
                                    rounded-lg
                                    bg-gray-50
                                ">

                                    <p className="text-sm text-gray-500">
                                        Wallet Address
                                    </p>


                                    <p className="
                                        font-mono
                                        text-sm
                                        break-all
                                        text-my-deep-blue
                                    ">
                                        {selectedNetwork.address}
                                    </p>


                                </div>

                                )
                            }






                            <div className="mt-4">


                                <label className="text-my-deep-blue text-[15px]">
                                    Upload Payment Proof
                                </label>


                                <input
                                    ref={proofRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e)=>{
                                        const file =
                                            e.currentTarget.files?.[0];

                                        if(file){
                                            setFieldValue(
                                                "proof",
                                                file
                                            );
                                        }
                                    }}
                                />



                                <div
                                    onClick={() =>
                                        proofRef.current?.click()
                                    }
                                    className="
                                        mt-2
                                        cursor-pointer
                                        border-2
                                        border-dashed
                                        rounded-xl
                                        p-8
                                        text-center
                                    "
                                >

                                    <Image
                                        src="/images/upload.png"
                                        alt="upload"
                                        width={40}
                                        height={40}
                                        className="mx-auto mb-2"
                                    />


                                    {
                                        values.proof ? (

                                            <p className="font-medium">
                                                ✓ {values.proof.name}
                                            </p>

                                        ) : (

                                            <p className="text-gray-500">
                                                Upload proof
                                            </p>

                                        )
                                    }


                                </div>


                            </div>





                            <button
                                type="submit"
                                disabled={!isValid || !dirty}
                                className="
                                    mt-4
                                    w-full
                                    bg-my-blue
                                    text-white
                                    py-3
                                    rounded-lg
                                "
                            >
                                Submit Investment
                            </button>


                        </Form>

                        )

                    }}


                    </Formik>

                    )
                }




                {
                    formState === "submitting" &&
                    <InProgress message="Submitting your investment, please wait" />
                }



                {
                    formState === "error" &&
                    <ErrorResponse message={responseMessage}/>
                }



                {
                    formState === "success" &&
                    <SuccessResponse message={responseMessage}/>
                }



                </section>


            </div>

        </div>

    );

};


export default AssetInvestment;