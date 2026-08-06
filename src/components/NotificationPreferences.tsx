"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "./InProgress";
import { Loader2 } from "lucide-react";


type Preferences = {
    investmentUpdates: boolean;
    walletActivity: boolean;
    accountSecurity: boolean;
    supportUpdates: boolean;
    platformUpdates: boolean;
};


const preferenceItems = [
    {
        key: "investmentUpdates",
        title: "Investment Updates",
        description:
            "Receive updates when your investments are processed or changed.",
    },
    {
        key: "walletActivity",
        title: "Wallet Activity",
        description:
            "Receive notifications about deposits, withdrawals, and wallet changes.",
    },
    {
        key: "accountSecurity",
        title: "Account & Security",
        description:
            "Receive important security alerts about your account.",
    },
    {
        key: "supportUpdates",
        title: "Support Updates",
        description:
            "Receive updates when there are changes to your support requests.",
    },
    {
        key: "platformUpdates",
        title: "Platform Updates",
        description:
            "Receive updates about new features and platform announcements.",
    },
] as const;



export default function NotificationPreferences() {


    const [preferences, setPreferences] = useState<Preferences | null>(null);


    const [loading, setLoading] = useState(true);


    const [updating, setUpdating] = useState<string | null>(null);


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");





    async function loadPreferences() {

        try {

            const response = await fetchWithAuth(
                "/api/settings/notifications"
            );


            const result = await response.json();


            if (result.success) {

                setPreferences(result.data);

            }


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load notification preferences."
            );

        } finally {

            setLoading(false);

        }

    }






    async function updatePreference(
        key: keyof Preferences,
        value: boolean
    ) {


        if (!preferences) return;


        setUpdating(key);

        setMessage("");

        setError("");



        const previous = preferences;



        setPreferences({

            ...preferences,

            [key]: value,

        });




        try {


            const response = await fetchWithAuth(
                "/api/settings/notifications",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({

                        [key]: value,

                    }),
                }
            );



            const result = await response.json();




            if (!response.ok) {


                setPreferences(previous);


                setError(
                    result.error ||
                    "Unable to update preferences."
                );


                return;

            }



            setMessage(
                "Notification preferences updated."
            );



        } catch (error) {


            console.error(error);


            setPreferences(previous);


            setError(
                "Something went wrong."
            );


        } finally {


            setUpdating(null);


        }


    }







    useEffect(() => {

        loadPreferences();

    }, []);






    if (loading) {

        return (
            <InProgress message="Loading preferences" />
        );

    }





    if (!preferences) {

        return (

            <p className="text-red-500">
                Unable to load notification preferences.
            </p>

        );

    }





    return (

        <div>


            <h2
                className="
                    text-xl
                    font-semibold
                    text-my-deep-blue
                "
            >
                Preferences
            </h2>



            <p
                className="
                    text-my-gray
                    mt-1
                    mb-8
                "
            >
                Manage the notifications you want to receive.
            </p>





            <div className="space-y-5">


                {
                    preferenceItems.map((item) => {


                        const enabled =
                            preferences[item.key];



                        return (

                            <div
                                key={item.key}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-5
                                    border
                                    border-my-gray/20
                                    rounded-xl
                                    p-5
                                "
                            >


                                <div>


                                    <h3
                                        className="
                                            font-medium
                                            text-my-deep-blue
                                        "
                                    >
                                        {item.title}
                                    </h3>



                                    <p
                                        className="
                                            text-sm
                                            text-my-gray
                                            mt-1
                                        "
                                    >
                                        {item.description}
                                    </p>


                                </div>





                                <button
                                    type="button"
                                    disabled={updating === item.key}
                                    onClick={() =>
                                        updatePreference(
                                            item.key,
                                            !enabled
                                        )
                                    }
                                    className={`
        relative
        w-12
        h-6
        rounded-full
        transition-all
        duration-300
        ease-in-out
        ${enabled
                                            ? "bg-my-blue"
                                            : "bg-my-gray/30"
                                        }
        ${updating === item.key
                                            ? "opacity-60 cursor-not-allowed"
                                            : ""
                                        }
    `}
                                >
                                    <span
                                        className={`
            absolute
            top-1
            left-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            duration-300
            ease-in-out
            ${enabled
                                                ? "translate-x-6"
                                                : "translate-x-0"
                                            }
            ${updating === item.key
                                                ? "scale-90"
                                                : "scale-100"
                                            }
        `}
                                    />
                                </button>


                            </div>

                        );


                    })
                }


            </div>





            {
                updating && (

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-my-gray
                            mt-5
                        "
                    >

                        <Loader2
                            size={16}
                            className="animate-spin"
                        />

                        Updating preference...

                    </div>

                )
            }





            {
                message && (

                    <div
                        className="
                            mt-5
                            rounded-lg
                            bg-green-50
                            border
                            border-green-200
                            px-4
                            py-3
                            text-green-600
                            text-sm
                        "
                    >
                        {message}
                    </div>

                )
            }




            {
                error && (

                    <div
                        className="
                            mt-5
                            rounded-lg
                            bg-red-50
                            border
                            border-red-200
                            px-4
                            py-3
                            text-red-600
                            text-sm
                        "
                    >
                        {error}
                    </div>

                )
            }


        </div>

    );

}