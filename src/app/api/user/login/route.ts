import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/mail/sendOTPMail";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { identifier, password } = body;

        console.log("this is the login request body:", body);

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, error: "Email/Username and password are required" },
                { status: 400 }
            );
        }

        const normalizedIdentifier = identifier.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let user;

        if (emailRegex.test(normalizedIdentifier)) {
            user = await prisma.user.findUnique({
                where: { email: normalizedIdentifier },
            });
        } else {
            user = await prisma.user.findUnique({
                where: { username: normalizedIdentifier },
            });
        }

        if (user && !user.emailVerified) {
            return NextResponse.json(
                { success: false, error: "Your email is not verified", user: { email: user.email } },
                { status: 403 }
            );
        }

        console.log("User found in database:", user);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials provided" },
                { status: 401 }
            );
        }

        const PEPPER = process.env.BCRYPT_PEPPER || "";
        const passwordMatches = await bcrypt.compare(password + PEPPER, user.password);

        console.log("Password match result:", passwordMatches);

        if (!passwordMatches) {
            return NextResponse.json(
                { success: false, error: "The password you entered is incorrect" },
                { status: 401 }
            );
        }

        // --- OTP GENERATION ---
        // 1. Delete any active existing login OTPs for this user
        await prisma.otpToken.deleteMany({
            where: { userId: user.id, purpose: "LOGIN_VERIFICATION" },
        }).catch(() => {});

        // 2. Generate secure 6-digit code
        const rawCode = crypto.randomInt(100000, 999999).toString();

        // 3. Hash code for DB storage
        const salt = await bcrypt.genSalt(10);
        const codeHash = await bcrypt.hash(rawCode, salt);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins TTL

        // 4. Save token to OtpToken model
        await prisma.otpToken.create({
            data: {
                userId: user.id,
                codeHash,
                purpose: "LOGIN_VERIFICATION",
                expiresAt,
            },
        });

        // 5. Send code via Email (matching your signup pattern)
        sendOtpEmail(user.email, rawCode).catch(console.error);

        console.log(`[OTP Dispatched] Code sent to email for user: ${user.email}`);

        return NextResponse.json(
            {
                success: true,
                requiresOtp: true,
                message: "Password verified. Please enter the verification code sent to your email.",
                userId: user.id,
                email: user.email,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}