import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET() {

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log("Access token from cookies me beginning:", accessToken);
  console.log("Refresh token from cookies me beginning:", refreshToken);

  try {
    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken, "access") as {
          id: string;
          email: string;
        };

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
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
          { user, success: true },
          { status: 200 }
        );

      } catch (error: any) {
        if (error.message !== "EXPIRED") {
          return NextResponse.json(
            { error: "Invalid access token" },
            { status: 401 }
          );
        }
      }
    }

    console.log("No valid access token, checking refresh token...");
    console.log("Refresh token from cookies post:", refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(refreshToken, "refresh") as {
      id: string;
      email: string;
    };

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });

    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
    });

    console.log("Refresh token valid, generated new tokens for user ID:", decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        kycStatus: true,
        accountType: true,
      },
    });

    const response = NextResponse.json(
      { user, success: true },
      { status: 200 }
    );

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}