import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { createSignedUrl } from "@/utils/createSignedUrl";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
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

    let user;

    try {
      user = verifyToken(accessToken, "access") as {
        id: string;
        email: string;
      };
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        accountType: true,
      },
    });

    if (
      !dbUser ||
      (dbUser.accountType !== "ADMIN" &&
        dbUser.accountType !== "DEV")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const transaction =
      await prisma.walletTransaction.findUnique({
        where: {
          id,
        },
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  accountType: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction not found",
        },
        {
          status: 404,
        }
      );
    }


    const proofUrl = transaction.proofPath
      ? await createSignedUrl(
          transaction.proofPath,
          "transactions"
        )
      : null;

console.log("Generated proof URL: ", proofUrl);
    return NextResponse.json({
      success: true,
      data: {
        ...transaction,

        
          proofUrl,
      },
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}