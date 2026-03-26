import jwt from "jsonwebtoken";

export function generateAccessToken(payload: object) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "5m",
    });
}

export function generateRefreshToken(payload: object) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "30m",
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
  
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;
  }

  export function verifyEmailToken(token: string) {
    try {
        return jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);
      } catch (err: any) {
        if (err.name === "TokenExpiredError") throw new Error("EXPIRED");
        throw new Error("INVALID");
      }
  }