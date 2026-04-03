import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accountType } = body;

    if (!accountType) {
      return NextResponse.json(
        { success: false, error: "Account type is required" },
        { status: 400 }
      );
    }

    if (accountType !== "INDIVIDUAL" && accountType !== "ENTERPRISE") {
      return NextResponse.json(
        { success: false, error: "Invalid account type" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token, "access");

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { accountType },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        kycStatus: true,
        accountType: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account type updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Account type update error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}