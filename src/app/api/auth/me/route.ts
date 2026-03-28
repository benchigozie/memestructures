import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, generateAccessToken } from "@/lib/jwt";

export async function GET() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

  try {

    if (accessToken) {
      const decoded = verifyToken(accessToken, "access") as {
        id: string;
        email: string;
      };

      return NextResponse.json({
        user: {
          id: decoded.id,
          email: decoded.email,
        },
        success : true,
      });
    }

  } catch (error: any) {

    if (error.message === "EXPIRED" && refreshToken) {
      try {

        const decoded = verifyToken(refreshToken, "refresh") as {
          id: string;
          email: string;
        };

        const newAccessToken = generateAccessToken({
          id: decoded.id,
          email: decoded.email,
        });

        const response = NextResponse.json({ user: decoded, newAccessToken });

        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });

        return response;

      } catch {
        return NextResponse.json(
          { error: "Refresh token invalid" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.json(
    { error: "Not authenticated" },
    { status: 401 }
  );
}