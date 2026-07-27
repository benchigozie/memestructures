import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function DELETE(
    req: Request,
    {
        params
    }: {
        params: Promise<{ id: string }>
    }
) {

    try {


        const { id } = await params;


        await prisma.user.update({

            where: {
                id
            },

            data: {

                accountStatus: "SUSPENDED",

                deletedAt: new Date()

            }

        });


        return NextResponse.json({

            message: "Account disabled"

        });


    }
    catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                error: "Failed disabling account"
            },
            {
                status: 500
            }
        )

    }

}




export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const admin = await getUserFromRequest();


    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    if (
      admin.accountType !== "ADMIN" &&
      admin.accountType !== "DEV" 
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status:403,
        }
      );
    }


    const { id } = await params;


    const user = await prisma.user.update({

      where:{
        id,
      },

      data:{
        accountStatus:"ACTIVE",
        deletedAt:null,
      },

    });


    return NextResponse.json({

      message:"Account re-enabled successfully",

      user:{
        id:user.id,
        email:user.email,
        status:user.accountStatus
      }

    });


  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        error:"Failed to re-enable account",
      },
      {
        status:500,
      }
    );

  }

}