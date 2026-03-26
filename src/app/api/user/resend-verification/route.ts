import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateEmailVerificationLink } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified" },
        { status: 400 }
      );
    }

    const verificationLink = generateEmailVerificationLink(user.id);

    await sendVerificationEmail(user.email, verificationLink);

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}