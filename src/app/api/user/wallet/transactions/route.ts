import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet not found",
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit") ?? 10);

    const transactions = await prisma.walletTransaction.findMany({
      where: {
        walletId: wallet.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      include: {
        investment: {
          select: {
            id: true,
            fund: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const nextCursor =
      transactions.length === limit
        ? transactions[transactions.length - 1].id  
        : null;

    return NextResponse.json({
      success: true,
      transactions,
      nextCursor,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}