import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";



export async function GET() {

    try {

        const user = await getUserFromRequest();


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated.",
                },
                {
                    status: 401,
                }
            );

        }




        let preferences =
            await prisma.notificationPreference.findUnique({
                where: {
                    userId: user.id,
                },
            });





        // Create default preferences for existing users

        if (!preferences) {

            preferences =
                await prisma.notificationPreference.create({

                    data: {

                        userId: user.id,

                    },

                });

        }





        return NextResponse.json({

            success: true,

            data: preferences,

        });




    } catch (error) {


        console.error(
            "Get notification preferences error:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error: "Could not fetch notification preferences.",
            },
            {
                status: 500,
            }
        );

    }

}







export async function PATCH(req: Request) {

    try {


        const user = await getUserFromRequest();



        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated.",
                },
                {
                    status: 401,
                }
            );

        }





        const body = await req.json();





        const allowedFields = [

            "investmentUpdates",

            "walletActivity",

            "accountSecurity",

            "supportUpdates",

            "platformUpdates",

        ];





        const updateData:any = {};





        for (const field of allowedFields) {


            if (field in body) {

                updateData[field] = Boolean(
                    body[field]
                );

            }

        }






        if (
            Object.keys(updateData).length === 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "No valid preferences provided.",
                },
                {
                    status: 400,
                }
            );

        }





        const preferences =
            await prisma.notificationPreference.upsert({

                where: {

                    userId: user.id,

                },

                update: updateData,

                create: {

                    userId: user.id,

                    ...updateData,

                },

            });







        return NextResponse.json({

            success: true,

            message:
                "Notification preferences updated.",

            data: preferences,

        });






    } catch (error) {


        console.error(
            "Update notification preferences error:",
            error
        );



        return NextResponse.json(
            {
                success: false,
                error: "Could not update notification preferences.",
            },
            {
                status: 500,
            }
        );

    }

}