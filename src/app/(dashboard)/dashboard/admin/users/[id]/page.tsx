"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";

import UserHero from "@/components/UserHero";
import UserProfile from "@/components/UserProfile";
import UserWallet from "@/components/UserWallet";
import UserInvestments from "@/components/UserInvestments";
import UserActivity from "@/components/UserActivity";

type UserPageProps = {
    params: {
        id: string;
    };
};

export type ManagedUser = {
    id: string;
    name: string;
    email: string;

    accountType: string;
    accountStatus: string;
    kycStatus: string;

    createdAt: string;

    wallet: {
        id: string;
        balance: number;
    } | null;

    investments: {
        id: string;
        amount: number;
        status: string;
        assetClass: {
            name: string;
        };
    }[];
};

export default function UserPage({
    params,
}: UserPageProps) {

    const [loading, setLoading] = useState(true);

    const [user, setUser] =
        useState<ManagedUser | null>(null);

    async function fetchUser() {

        try {

            const res = await fetchWithAuth(
                `/api/admin/users/${params.id}`
            );

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.error);

            }

            setUser(data);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchUser();

    }, []);

    if (loading) {

        return (
            <InProgress message="Loading client" />
        );

    }

    if (!user) {

        return (
            <div className="p-6">
                User not found.
            </div>
        );

    }

    return (

        <div className="p-6 space-y-8">

            <Link
                href="/dashboard/admin/users"
                className="inline-flex items-center gap-2 text-my-blue hover:text-my-deep-blue"
            >
                <ArrowLeft size={18} />

                Back to Clients
            </Link>

            <UserHero user={user} />

            <UserProfile
                user={user}
                refreshUser={fetchUser}
            />

            <UserWallet
                user={user}
                refreshUser={fetchUser}
            />

            <UserInvestments
                user={user}
                refreshUser={fetchUser}
            />

            <UserActivity
                user={user}
            />

        </div>

    );

}