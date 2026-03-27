import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePasswordResetLink } from "@/lib/jwt";
import { sendResetEmail } from "@/lib/email";

export async function POST(req: Request) {

    const start = Date.now();

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });


    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    const resetLink = generatePasswordResetLink(user.id);

    await sendResetEmail(user.email, resetLink);

    console.log("Password reset email sent to:", user.email);

    const minProcessingTime = 300;
    const elapsed = Date.now() - start;
    if (elapsed < minProcessingTime) {
      await new Promise((resolve) => setTimeout(resolve, minProcessingTime - elapsed));
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}