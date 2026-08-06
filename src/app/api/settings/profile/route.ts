import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { createSignedUrl } from "@/utils/createSignedUrl";



export async function GET(req: Request) {

    try {

        const user = await getUserFromRequest();


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated",
                },
                {
                    status: 401,
                }
            );

        }



        const profile = await prisma.user.findUnique({

            where: {
                id: user.id,
            },


            select: {

                id: true,

                name: true,

                username: true,

                email: true,

                profileImagePath: true,


                accountType: true,

                kycStatus: true,


                createdAt: true,


                individualKyc: {

                    select: {

                        firstName: true,

                        lastName: true,

                        phone: true,

                        dob: true,

                        gender: true,

                        country: true,

                        state: true,

                    }

                }

            }

        });


        if (!profile) {

            return NextResponse.json(
                {
                    success: false,
                    error: "User profile not found",
                },
                {
                    status: 404,
                }
            );

        }
        let profileImageUrl = "";



        if (profile.profileImagePath) {

            profileImageUrl = await createSignedUrl(
                profile.profileImagePath,
                "images"
            );

        }
       



        return NextResponse.json({

            success: true,
            data: {
                ...profile,
                profileImageUrl
             },

        });



    } catch (err: any) {


        console.error(err);


        return NextResponse.json(
            {
                success: false,
                error: err.message || "Failed to fetch profile",
            },
            {
                status: 500,
            }
        );

    }

}

