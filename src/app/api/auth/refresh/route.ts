import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
    try {

        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: "No refresh token provided" },
                { status: 401 }
            );
        }

        let payload: any;

        try {
            payload = verifyToken(refreshToken, "refresh");
        } catch (err: any) {

            const response = NextResponse.json(
                { success: false, error: err.message === "EXPIRED" ? "Refresh token expired" : "Invalid token" },
                { status: 401 }
            );
            response.cookies.delete("refreshToken");
            return response;
        }

        const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
        const newRefreshToken = generateRefreshToken({ id: payload.id });


        const response = NextResponse.json(
            { success: true, accessToken },
            { status: 200 }
        );

        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 40 * 60,
        });

        return response;

    } catch (error) {
        console.error("Refresh token error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}