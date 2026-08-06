"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    Clock,
    CheckCircle,
    AlertTriangle,
    FileWarning,
    ShieldCheck,
} from "lucide-react";
import Image from "next/image";


type KycStatus =
    | "UNVERIFIED"
    | "VERIFIED"
    | "PENDING"
    | "REJECTED"
    | "UNCOMPLETED";


interface Props {
    status: KycStatus;
    rejectionReason?: string | null;
}


export default function KycStatusCard({

    status,

    rejectionReason,

}: Props) {


    const { user } = useAuth();


    const content = {

        UNVERIFIED: {

            icon: ShieldCheck,

            title: "Verification Required",

            description:
                "Complete your identity verification to unlock investment features.",

            action: "Start Verification",

            href: "/dashboard/kyc",

            style:
                "border-yellow-200 bg-yellow-50",

            iconStyle:
                "text-yellow-600",

        },


        UNCOMPLETED: {

            icon: FileWarning,

            title: "Complete Your Verification",

            description:
                "Your verification process is incomplete. Please submit the required information to continue.",

            action: "Continue Verification",

            href: "/dashboard/kyc",

            style:
                "border-yellow-200 bg-yellow-50",

            iconStyle:
                "text-yellow-600",

        },


        PENDING: {

            icon: Clock,

            title: "Verification Pending",

            description:
                "Your documents have been submitted and are currently being reviewed.",

            action: null,

            href: null,

            style:
                "border-blue-200 bg-blue-50",

            iconStyle:
                "text-blue-600",

        },


        REJECTED: {

            icon: AlertTriangle,

            title: "Verification Failed",

            description:
                "Your verification could not be approved. Please review your information and submit again.",

            action: "Review Verification",

            href: "/dashboard/kyc",

            style:
                "border-red-200 bg-red-50",

            iconStyle:
                "text-red-600",

        },


        VERIFIED: {

            icon: CheckCircle,

            title: "Verification Complete",

            description:
                "Your identity has been successfully verified.",

            action: null,

            href: null,

            style:
                "border-green-200 bg-green-50",

            iconStyle:
                "text-green-600",

        },

    }[status];



    const Icon = content.icon;



    return (

        <div
            className="
                mx-auto
                w-full
                max-w-2xl
                space-y-6
                px-4
                text-center
                flex
                flex-col
                items-center
                justify-center
                min-h-[60vh]
            "
        >
    
            {/* Welcome Message */}
    
            <div>
    
                <h1
                    className="
                        text-2xl
                        md:text-3xl
                        font-semibold
                        text-my-deep-blue
                    "
                >
                    Hi {user?.name || "there"}, welcome back <Image src="/images/wave.png" alt="Hand Wave" width={40} height={40} className="inline-block ml-1" />
                </h1>
    
    
                <p
                    className="
                        mt-1
                        text-my-gray
                    "
                >
                    Here is your verification status and next steps.
                </p>
    
            </div>
    
            <div
                className={`
                    rounded-xl
                    border
                    p-6
                    ${content.style}
                `}
            >
    
                <div
                    className="
                        flex
                        flex-col
                        
                        gap-4
                       items-center
                    "
                >
    
                    <div>
    
                        <Icon
                            size={28}
                            className={content.iconStyle}
                        />
    
                    </div>
    
    
                    <div className="flex-1">
    
                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-my-deep-blue
                            "
                        >
                            {content.title}
                        </h2>
    
    
                        <p
                            className="
                                mt-2
                                text-my-gray
                            "
                        >
                            {content.description}
                        </p>
    
    
                        {
                            status === "REJECTED" &&
                            rejectionReason && (
    
                                <div
                                    className="
                                        mt-4
                                        rounded-lg
                                        bg-white
                                        border
                                        border-red-200
                                        p-3
                                        text-sm
                                        text-red-600
                                    "
                                >
    
                                    <strong>
                                        Reason:
                                    </strong>
    
                                    {" "}
    
                                    {rejectionReason}
    
                                </div>
    
                            )
                        }
    
    
                        {
                            content.action &&
                            content.href && (
    
                                <Link
    
                                    href={content.href}
    
                                    className="
                                        inline-flex
                                        mt-5
                                        rounded-lg
                                        bg-my-blue
                                        px-5
                                        py-2.5
                                        text-white
                                        font-medium
                                        hover:opacity-90
                                    "
                                >
    
                                    {content.action}
    
                                </Link>
    
                            )
                        }
    
    
                    </div>
    
                </div>
    
            </div>
    
        </div>
    
    );

}