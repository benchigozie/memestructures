import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyEmailToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      );
    }

    let payload;

    try {
      payload = verifyEmailToken(token);
    } catch (err: any) {
      if (err.message === "EXPIRED") {
        return NextResponse.json(
          { success: false, error: "Verification link has expired. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Invalid verification link." },
        { status: 400 }
      );
    }

    const userId = (payload as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      }),
    
      prisma.wallet.upsert({
        where: {
          userId: userId,
        },
        update: {},
        create: {
          userId: userId,
          balance: 0,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Your email has been verified successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}