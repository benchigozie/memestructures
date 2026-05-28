import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { amount, assetClass, method } = body;

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        { success: false, error: "Complete KYC before investing" },
        { status: 403 }
      );
    }

    const fund = await prisma.fund.findUnique({
      where: { slug: assetClass },
    });

    if (!fund) {
      return NextResponse.json(
        { success: false, error: "Invalid fund selected" },
        { status: 400 }
      );
    }

    if (!amount || !method) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fee = amount * 0.01;
    const total = amount + fee;

    if (method === "WALLET") {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });

      if (!wallet) {
        return NextResponse.json(
          { success: false, error: "Wallet not found" },
          { status: 404 }
        );
      }

      if (wallet.balance < total) {
        return NextResponse.json(
          { success: false, error: "Insufficient wallet balance" },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { userId: user.id },
          data: { balance: { decrement: total } },
        });
      
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "WITHDRAWAL",
            intent: "DIRECT_INVESTMENT",
            amount: total,
            status: "COMPLETED",
            reference: `INV-${Date.now()}`,
          },
        });
      
        const investment = await tx.investment.create({
          data: {
            userId: user.id,
            fundId: fund.id,
            amount,
            fee,
            total,
            method,
            status: "CONFIRMED",
          },
        });
      
        await tx.position.upsert({
          where: {
            userId_fundId: {
              userId: user.id,
              fundId: fund.id,
            },
          },
          update: {
            amount: { increment: amount },
          },
          create: {
            userId: user.id,
            fundId: fund.id,
            amount,
          },
        });
      
        return investment;
      });
    }

 
 

    return NextResponse.json({
      success: true,
      message: "Asset Funded successfully",
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}