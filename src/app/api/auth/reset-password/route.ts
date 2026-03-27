import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyPasswordResetToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    console.log("Reset password request body:", body);

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters, include uppercase, lowercase, and a number" },
        { status: 400 }
      );
    }

    
    let userId: string;
    try {
      const payload: any = verifyPasswordResetToken(token);
      userId = payload.id;
      console.log("Token verified in route, user ID:", userId);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message === "EXPIRED" ? "Token expired" : "Invalid token" },
        { status: 400 }
      );
    }

    const PEPPER = process.env.BCRYPT_PEPPER || "";
    const hashedPassword = await bcrypt.hash(newPassword + PEPPER, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    const minProcessingTime = 300;
    const elapsed = Date.now() - start;
    if (elapsed < minProcessingTime) {
      await new Promise((resolve) => setTimeout(resolve, minProcessingTime - elapsed));
    }

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}