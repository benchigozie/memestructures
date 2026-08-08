import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Params
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
          error: "You do not have permission to view this user.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    

    const user = await prisma.user.findFirst({
      where: {
        id,
        createdById: admin.id,
        deletedAt: null,
      },

      include: {
        wallet: true,

        position: {
          include: {
            assetClass: {
              select: {
                id: true,
                name: true,
                acronym: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        investments: {
          include: {
            assetClass: {
              select: {
                id: true,
                name: true,
                acronym: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,

      accountType: user.accountType,
      accountStatus: user.accountStatus,
      kycStatus: user.kycStatus,
      emailVerified: user.emailVerified,
     

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      wallet: user.wallet,

      positions: user.position,

      investments: user.investments,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed fetching user.",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PATCH(
    req: Request,
    { params }: Params
) {
    try {

        const admin = await getUserFromRequest();

        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (
            admin.accountType !== "ADMIN" &&
            admin.accountType !== "DEV"
        ) {
            return NextResponse.json(
                {
                    error: "You do not have permission to edit this user."
                },
                {
                    status: 403
                }
            );
        }

        const { id } = await params;

        const body = await req.json();

        const {
            name,
            email,
            accountType,
            accountStatus,
            kycStatus,
        } = body;

        const user = await prisma.user.findFirst({
            where: {
                id,
                createdById: admin.id,
                deletedAt: null,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found."
                },
                {
                    status: 404
                }
            );
        }

        if (email && email !== user.email) {

            const existing = await prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });

            if (existing) {
                return NextResponse.json(
                    {
                        error: "Email already exists."
                    },
                    {
                        status: 409
                    }
                );
            }
        }

        const updated = await prisma.user.update({

            where: {
                id,
            },

            data: {

                ...(name !== undefined && {
                    name,
                }),

                ...(email !== undefined && {
                    email: email.toLowerCase().trim(),
                }),

                ...(accountType !== undefined && {
                    accountType,
                }),

                ...(accountStatus !== undefined && {
                    accountStatus,
                }),

                ...(kycStatus !== undefined && {
                    kycStatus,
                }),

            },

        });

        return NextResponse.json({
            message: "User updated successfully.",
            user: updated,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Failed updating user."
            },
            {
                status: 500
            }
        );

    }
}