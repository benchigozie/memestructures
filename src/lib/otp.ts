import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, code } = body;

        console.log("this is the verify-otp request body:", body);

        if (!userId || !code) {
            return NextResponse.json(
                { success: false, error: "User ID and verification code are required" },
                { status: 400 }
            );
        }

        const otpRecord = await prisma.otpToken.findFirst({
            where: { userId, purpose: "LOGIN_VERIFICATION" },
            include: { user: true },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { success: false, error: "No active verification code found or it has expired" },
                { status: 400 }
            );
        }

        // Check expiration
        if (new Date() > otpRecord.expiresAt) {
            await prisma.otpToken.delete({ where: { id: otpRecord.id } }).catch(() => {});
            return NextResponse.json(
                { success: false, error: "Verification code has expired. Please log in again." },
                { status: 400 }
            );
        }

        // Check attempt limits (Max 3 attempts)
        if (otpRecord.attempts >= 3) {
            await prisma.otpToken.delete({ where: { id: otpRecord.id } }).catch(() => {});
            return NextResponse.json(
                { success: false, error: "Maximum verification attempts exceeded. Please log in again." },
                { status: 401 }
            );
        }

        // Compare code hash
        const codeMatches = await bcrypt.compare(code, otpRecord.codeHash);

        console.log("OTP code match result:", codeMatches);

        if (!codeMatches) {
            await prisma.otpToken.update({
                where: { id: otpRecord.id },
                data: { attempts: otpRecord.attempts + 1 },
            });

            return NextResponse.json(
                { success: false, error: "The verification code you entered is incorrect" },
                { status: 401 }
            );
        }

        // Success: Delete token immediately (Single Consumption Rule)
        await prisma.otpToken.delete({ where: { id: otpRecord.id } }).catch(() => {});

        const user = otpRecord.user;

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            req.headers.get("x-real-ip") ||
            "Unknown";

        const userAgent =
            req.headers.get("user-agent") || "Unknown device";

        const loginTime = new Date().toLocaleString();

        console.log(`OTP Verification successful for user ${user.email}. About to send notification and email. IP: ${ip}, User Agent: ${userAgent}, Time: ${loginTime}`);
        
        sendNotification({
            userId: user.id,
            title: "Login Successful",
            message: `Your account was accessed successfully from ${ip}.`,
            type: "INFO",
            link: "/dashboard",
        }).catch(console.error);

        sendEmail({
            to: user.email,
            subject: "New Login Detected",
            html: notificationTemplate({
                title: "New Login Detected",
                message: `
                    We detected a successful login to your account.<br /><br />
              
                    <strong>IP Address:</strong> ${ip}<br />
                    <strong>Device:</strong> ${userAgent}<br />
                    <strong>Time:</strong> ${loginTime}<br /><br />  

                    If this was you, no further action is required.
                    If you do not recognize this activity, please change your password immediately and contact support.
                  `,
                buttonText: "Open Dashboard",
                buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            }),
        }).catch(console.error);

        const response = NextResponse.json(
            {
                success: true,
                message: "Logged in successfully",
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    username: user.username, 
                    kycStatus: user.kycStatus, 
                    accountType: user.accountType 
                },
            },
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 5 * 60,
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60,
        });

        return response;

    } catch (error) {
        console.error("OTP Verification error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}