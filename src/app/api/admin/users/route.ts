import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";


export async function GET() {

    try {

        const admin = await getUserFromRequest();


        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }


        const users = await prisma.user.findMany({


            where:{
                 accountType: "INDIVIDUAL",
                createdById: admin.id
             },

            select: {
                id: true,
                name: true,
                email: true,
                accountStatus: true,
                kycStatus: true,
                createdAt: true,
                accountType: true,

                wallet: {
                    select: {
                        id: true,
                        balance: true,
                    }
                }
            },

           

            orderBy: {
                createdAt: "desc"
            }

        });


        return NextResponse.json(users);


    }
    catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Failed fetching users"
            },
            {
                status: 500
            }
        )

    }

}