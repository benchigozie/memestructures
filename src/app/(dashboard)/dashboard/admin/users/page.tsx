"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, Pencil, Ban } from "lucide-react";
import CreateInvestorForm from "@/components/CreateInvestorForm";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import Link from "next/link";


type ManagedUser = {
    id: string;
    name: string;
    email: string;
    accountType: string;
    accountStatus: string;
    kycStatus: string;
    wallet: {
        balance: number;
    } | null;
};


export default function Page() {

    const [showCreate, setShowCreate] = useState(false);
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        fetchUsers();
    }, []);



    async function fetchUsers() {

        try {

            const res = await fetchWithAuth(
                "/api/admin/users"
            );

            const data = await res.json();


            if (res.ok) {
                setUsers(data);
            }


        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }



    return (

        <div className="p-4">


            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="
                    text-2xl 
                    font-bold 
                    text-my-deep-blue
                    ">
                        User Accounts
                    </h1>

                    <p className="text-my-gray">
                        Manage users created by your account.
                    </p>
                </div>


                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-my-blue
                px-6
                py-3
                text-white
                hover:bg-my-deep-blue
                transition-colors
                duration-300
                cursor-pointer
                "
                >

                    <Plus size={18} />

                    Create User

                    <div className={`${showCreate ? "rotate-180" : ""} transition-transform duration-400`}>
                        <ChevronDown size={18} />
                    </div>

                </button>


            </div>



            {
                showCreate &&
                <div className="
                mb-8
                rounded-xl
                border
                border-my-gray/20
                "
                >

                    <CreateInvestorForm
                        refreshUsers={fetchUsers}
                    />

                </div>
            }





            <div className="space-y-4">

                {
                    loading && <InProgress message="Loading users" />
                }

                {
                    users.map(user => (

                        <div
                            key={user.id}
                            className="
                    rounded-xl
                    border
                    border-my-gray/20
                    p-6
                    "
                        >


                            <div className="
                    flex
                    justify-between
                    items-start
                    ">


                                <div>

                                    <h3 className="
                            font-semibold
                            text-lg
                            text-my-deep-blue
                            ">
                                        {user.name}
                                    </h3>


                                    <p className="text-sm text-my-gray">
                                        {user.email}
                                    </p>


                                </div>



                                <div className="flex gap-2">


                                   
                                        <Link href={`/dashboard/admin/users/${user.id}`}>
                                        <button
                                        className="
                            rounded-lg
                            p-2
                            hover:bg-my-blue/10
                            cursor-pointer
                            "
                                    >

                                            <Pencil size={18} />
                                            </button>
                                        </Link>

                                    



                                    <button
                                        className="
                            rounded-lg
                            p-2
                            text-red-500
                            hover:bg-red-50
                            cursor-pointer
                            "
                                    >

                                        <Ban size={18} />

                                    </button>


                                </div>


                            </div>



                            <div className="
                    mt-5
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-4
                    ">


                                <div>
                                    <p className="text-xs text-my-gray">
                                        Type
                                    </p>

                                    <p className="font-medium">
                                        {user.accountType}
                                    </p>

                                </div>


                                <div>
                                    <p className="text-xs text-my-gray">
                                        KYC
                                    </p>

                                    <p className="font-medium">
                                        {user.kycStatus}
                                    </p>

                                </div>



                                <div>
                                    <p className="text-xs text-my-gray">
                                        Wallet
                                    </p>

                                    <p className="font-medium">
                                        ₦
                                        {user.wallet?.balance
                                            .toLocaleString()
                                            ??
                                            "0"}
                                    </p>

                                </div>



                                <div>

                                    <p className="text-xs text-my-gray">
                                        Status
                                    </p>

                                    <p className="font-medium">
                                        {user.accountStatus}
                                    </p>

                                </div>



                            </div>



                        </div>

                    ))
                }


            </div>


        </div>

    )
}