import jwt from "jsonwebtoken";

interface AccessTokenPayload {
    id: string;
    email: string;
}

interface RefreshTokenPayload {
    id: string;
}

export function generateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "5m",
    });
}

export function generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "3h", //set this back to 30min
    });
}

export function verifyToken(token: string, type: "access" | "refresh") {
    const secret =
        type === "access"
            ? process.env.ACCESS_TOKEN_SECRET!
            : process.env.REFRESH_TOKEN_SECRET!;

    try {
        return jwt.verify(token, secret);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new Error("EXPIRED");
        }
        throw new Error("INVALID");
    }
}

export function generateEmailVerificationLink(userId: string) {
    const token = jwt.sign(
        { id: userId },
        process.env.EMAIL_VERIFICATION_SECRET!,
        { expiresIn: "1h" }
    );

    return `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
}

export function verifyEmailToken(token: string) {
    try {
        return jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") throw new Error("EXPIRED");
        throw new Error("INVALID");
    }
}

export function generatePasswordResetLink(userId: string) {
    const token = jwt.sign(
        { id: userId, type: "password-reset" },
        process.env.PASSWORD_RESET_SECRET!,
        { expiresIn: "15m" }
    );

    return `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
}

export function verifyPasswordResetToken(token: string) {
    try {
        const payload: any = jwt.verify(token, process.env.PASSWORD_RESET_SECRET!);
        console.log("Decoded password reset token payload:", payload);

        if (payload.type !== "password-reset") {
            throw new Error("INVALID");
        }
        
        console.log("Token is valid, user ID, about to return:", payload.id);
        return payload;
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new Error("EXPIRED");
        }
        throw new Error("INVALID");
    }
}