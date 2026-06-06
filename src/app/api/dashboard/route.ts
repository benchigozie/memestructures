
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      wallet,
      positions,
      investments,
      recentActivity,
    ] = await Promise.all([
      prisma.wallet.findUnique({
        where: {
          userId: user.id,
        },
      }),

      prisma.position.findMany({
        where: {
          userId: user.id,
        },
        include: {
          fund: true,
        },
      }),

      prisma.investment.findMany({
        where: {
          userId: user.id,
          status: "CONFIRMED",
        },
      }),

      prisma.walletTransaction.findMany({
        where: {
          wallet: {
            userId: user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    const totalPortfolio = positions.reduce(
      (sum, pos) => sum + pos.amount,
      0
    );

    const allocation = positions.map((position) => ({
      name: position.fund.slug.toUpperCase(),
      fullName: position.fund.name,
      amount: position.amount,
      percentage:
        totalPortfolio > 0
          ? Number(
              ((position.amount / totalPortfolio) * 100).toFixed(2)
            )
          : 0,
    }));

    return NextResponse.json({
      walletBalance: wallet?.balance ?? 0,
      totalInvested,
      assetClasses: positions.length,
      allocation,
      recentActivity,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}