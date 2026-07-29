"use client";

import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import PopUp from "@/components/PopUp";


type Investment = {
    id: string;
    amount: number;
    status: string;

    assetClass: {
        name: string;
    };
};


type AssetClass = {
    id: string;
    name: string;

    fees: {
        id: string;
        name: string;
        percentage: number;
    }[];
};


type Props = {
    user: {
        id: string;
        investments: Investment[];
    };

    refreshUser: () => void;
};



const validationSchema = Yup.object({

    assetClassId: Yup.string()
        .required("Asset class is required"),

    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),

    method: Yup.string()
        .required("Investment method required")

});



export default function UserInvestments({
    user,
    refreshUser
}: Props) {


    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [assetClasses, setAssetClasses] =
        useState<AssetClass[]>([]);

    const [loadingAssets, setLoadingAssets] =
        useState(false);

    const [selectedAsset, setSelectedAsset] =
        useState<AssetClass | null>(null);

        const [investmentToDelete, setInvestmentToDelete] =
    useState<Investment | null>(null);


    useEffect(() => {

        fetchAssetClasses();

    }, []);




    async function fetchAssetClasses() {

        try {

            setLoadingAssets(true);


            const res = await fetchWithAuth(
                "/api/admin/asset-classes"
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(data.error);

            }


            setAssetClasses(data);


        } catch (error) {

            console.error(error);

        } finally {

            setLoadingAssets(false);

        }

    }





    async function createInvestment(values: any) {


        try {

            setLoading(true);


            const amount =
                Number(values.amount) || 0;


            const totalFeePercentage =
                selectedAsset?.fees.reduce(
                    (sum, fee) =>
                        sum + fee.percentage,
                    0
                ) || 0;



            const calculatedFee =
                amount * (totalFeePercentage / 100);



            const total =
                amount + calculatedFee;



            const response = await fetchWithAuth(

                `/api/admin/users/${user.id}/investments`,

                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        ...values,

                        fee: calculatedFee,

                        total

                    })

                }

            );



            if (!response.ok) {

                const error =
                    await response.json();


                throw new Error(
                    error.message
                );

            }



            setShowForm(false);

            refreshUser();


        }
        catch (error: any) {

            alert(error.message);

        }
        finally {

            setLoading(false);

        }

    }


    async function deleteInvestment(investmentId: string) {

        try {
    
            setLoading(true);
    
    
            const response = await fetchWithAuth(
                `/api/admin/users/${user.id}/investments/${investmentId}`,
                {
                    method: "DELETE",
                }
            );
    
    
            const data = await response.json();
    
    
            if (!response.ok) {
    
                throw new Error(
                    data.message || "Failed to delete investment"
                );
    
            }
    
    
            refreshUser();
    
    
        } catch (error: any) {
    
            alert(error.message);
    
        } finally {
    
            setLoading(false);
    
        }
    
    }


    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">


            <div className="flex justify-between mb-6">


                <h2 className="text-xl font-bold text-my-deep-blue">
                    Investments
                </h2>


                <button

                    onClick={() => setShowForm(true)}

                    className="
                        bg-my-blue
                        text-white
                        hover:bg-my-deep-blue
                        transition-colors
                        duration-300
                        cursor-pointer
                        px-5
                        py-2
                        rounded-lg
                    "

                >

                    Add Investment

                </button>


            </div>





            {
                user.investments.length === 0 ? (

                    <p className="text-my-gray">
                        No investments found
                    </p>

                ) : (

                    <div className="space-y-4">

                        {
                            user.investments.map((investment) => (

                                <div
                                    key={investment.id}
                                    className="
                                        outline
                                        outline-my-gray/20
                                        rounded-lg
                                        p-5
                                        flex
                                        justify-between
                                        items-center
                                    "
                                >

                                    <div>

                                        <h3 className="font-semibold">
                                            {investment.assetClass.name}
                                        </h3>


                                        <p className="text-my-gray">
                                            $
                                            {investment.amount.toLocaleString("en-US")}
                                        </p>


                                        <p className="text-sm">
                                            {investment.status}
                                        </p>


                                    </div>



                                    <div className="flex gap-2">



                                        <button
                                              onClick={() => setInvestmentToDelete(investment)}
                                            disabled={loading}
                                            className="
        rounded-lg
        border
        border-red-500
        hover:bg-red-100
        cursor-pointer
        duration-300
        transition-colors
        text-red-500
        px-4
        py-2
        disabled:opacity-50
    "
                                        >
                                            {loading ? "Deleting..." : "Delete"}
                                        </button>

                                    </div>


                                </div>

                            ))
                        }

                    </div>

                )

            }







            {
                showForm && (

                    <div className="
                        fixed
                        inset-0
                        bg-black/40
                        flex
                        items-center
                        justify-center
                    ">


                        <div className="
                            bg-white
                            rounded-xl
                            p-6
                            m-1
                            w-full
                            max-w-lg
                        ">


                            <h3 className="text-lg font-bold mb-5">
                                Add Investment
                            </h3>





                            <Formik

                                initialValues={{

                                    assetClassId: "",
                                    amount: "",
                                    method: "DIRECT"

                                }}


                                validationSchema={validationSchema}


                                onSubmit={createInvestment}


                            >

                                {({
                                    values,
                                    isSubmitting,
                                    setFieldValue
                                }) => {


                                    const amount =
                                        Number(values.amount) || 0;



                                    const totalFeePercentage =
                                        selectedAsset?.fees.reduce(
                                            (sum, fee) =>
                                                sum + fee.percentage,
                                            0
                                        ) || 0;



                                    const calculatedFee =
                                        amount *
                                        (totalFeePercentage / 100);



                                    const total =
                                        amount +
                                        calculatedFee;



                                    return (

                                        <Form className="space-y-4">



                                            <div>

                                                <label>
                                                    Asset Class
                                                </label>


                                                <Field

                                                    as="select"

                                                    name="assetClassId"

                                                    className="
                                                w-full
                                                border
                                                rounded-lg
                                                p-3
                                            "

                                                    onChange={(e: any) => {


                                                        const asset =
                                                            assetClasses.find(
                                                                item =>
                                                                    item.id === e.target.value
                                                            );


                                                        setSelectedAsset(
                                                            asset || null
                                                        );


                                                        setFieldValue(
                                                            "assetClassId",
                                                            e.target.value
                                                        );


                                                    }}

                                                >

                                                    <option value="">
                                                        {
                                                            loadingAssets
                                                                ?
                                                                "Loading asset classes..."
                                                                :
                                                                "Select asset"
                                                        }
                                                    </option>



                                                    {
                                                        assetClasses.map(asset => (

                                                            <option
                                                                key={asset.id}
                                                                value={asset.id}
                                                            >

                                                                {asset.name}

                                                            </option>

                                                        ))
                                                    }


                                                </Field>


                                                <ErrorMessage

                                                    name="assetClassId"

                                                    component="p"

                                                    className="text-red-500 text-sm"

                                                />


                                            </div>






                                            <div>

                                                <label>
                                                    Amount
                                                </label>


                                                <Field

                                                    name="amount"

                                                    type="number"

                                                    className="
                                                w-full
                                                border
                                                rounded-lg
                                                p-3
                                            "

                                                />


                                                <ErrorMessage

                                                    name="amount"

                                                    component="p"

                                                    className="text-red-500 text-sm"

                                                />


                                            </div>






                                            {
                                                selectedAsset &&
                                                amount > 0 && (

                                                    <div className="
                                                rounded-lg
                                                bg-gray-50
                                                p-4
                                                space-y-2
                                            ">


                                                        {
                                                            selectedAsset.fees.map(
                                                                fee => (

                                                                    <div
                                                                        key={fee.id}
                                                                        className="
                                                                flex
                                                                justify-between
                                                            "
                                                                    >

                                                                        <span>
                                                                            {fee.name}
                                                                            ({fee.percentage}%)
                                                                        </span>


                                                                        <span>
                                                                            $
                                                                            {
                                                                                (
                                                                                    amount *
                                                                                    fee.percentage /
                                                                                    100
                                                                                ).toLocaleString("en-US")
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                ))
                                                        }



                                                        <div className="
                                                    border-t
                                                    border-my-gray/20
                                                    pt-2
                                                    flex
                                                    justify-between
                                                    font-semibold
                                                ">

                                                            <span>
                                                                Total Fees ({totalFeePercentage}%)
                                                            </span>


                                                            <span>
                                                                $
                                                                {calculatedFee.toLocaleString("en-US")}
                                                            </span>


                                                        </div>



                                                        <div className="
                                                    flex
                                                    justify-between
                                                    font-bold
                                                    text-my-deep-blue
                                                ">

                                                            <span>
                                                                Total
                                                            </span>


                                                            <span>
                                                                $
                                                                {total.toLocaleString("en-US")}
                                                            </span>


                                                        </div>


                                                    </div>

                                                )

                                            }






                                            <div>

                                                <label>
                                                    Method
                                                </label>


                                                <Field

                                                    as="select"

                                                    name="method"

                                                    className="
                                                w-full
                                                border
                                                rounded-lg
                                                p-3
                                            "

                                                >

                                                    <option value="DIRECT">
                                                        Direct
                                                    </option>


                                                    <option value="WALLET">
                                                        Wallet
                                                    </option>


                                                </Field>


                                            </div>







                                            <div className="flex justify-end gap-3">


                                                <button

                                                    type="button"

                                                    onClick={() => setShowForm(false)}

                                                    className="
                                                border
                                                px-5
                                                py-2
                                                rounded-lg
                                            "

                                                >

                                                    Cancel

                                                </button>



                                                <button

                                                    disabled={
                                                        loading ||
                                                        isSubmitting
                                                    }

                                                    className="
                                                bg-my-blue
                                                hover:bg-my-deep-blue
                                                transition-colors
                                                duration-300
                                                cursor-pointer
                                                text-white
                                                px-5
                                                py-2
                                                rounded-lg
                                            "

                                                >

                                                    {
                                                        loading
                                                            ?
                                                            "Saving..."
                                                            :
                                                            "Save"
                                                    }

                                                </button>


                                            </div>


                                        </Form>

                                    )

                                }}


                            </Formik>


                        </div>


                    </div>

                )
            }

{
    investmentToDelete && (

        <PopUp

            title="Delete Investment"

            message={
                `Are you sure you want to delete the ${investmentToDelete.assetClass.name} investment?`
            }

            onConfirm={() => {

                deleteInvestment(
                    investmentToDelete.id
                );

                setInvestmentToDelete(null);

            }}

            onClose={() => setInvestmentToDelete(null)}

        />

    )
}

        </section>

    );

}