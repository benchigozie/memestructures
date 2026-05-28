import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    const userId = user.id;
  
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });
  
    if (!wallet) {
      return NextResponse.json({
        success: false,
        error: "Wallet not found",
      });
    }
  
    return NextResponse.json({
      success: true,
      wallet,
    });
  }