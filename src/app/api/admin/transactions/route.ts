import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    let user;

    try {
      user = verifyToken(accessToken, "access") as {
        id: string;
        email: string;
      };
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error:
            err.message === "EXPIRED"
              ? "Token expired"
              : "Invalid token",
        },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
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
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where = {
      ...(status && { status: status as any }),
      ...(type && { type: type as any }),
    };

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),

      prisma.walletTransaction.count({
        where,
      }),
    ]);

    const data = transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      intent: tx.intent,
      status: tx.status,
      reference: tx.reference,
      proofPath: tx.proofPath,
      createdAt: tx.createdAt,

      user: {
        id: tx.wallet.user.id,
        name: tx.wallet.user.name,
        email: tx.wallet.user.email,
      },
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("TRANSACTIONS FETCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}