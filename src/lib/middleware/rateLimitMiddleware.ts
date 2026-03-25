import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, limits } from "@/lib/rateLimit";

const routeMap: Record<string, keyof typeof limits> = {
  "/api/user/login": "login",
  "/api/user/signup": "signup",
  "/api/lead": "lead",
};

export async function rateLimitMiddleware(req: NextRequest) {

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "local";

  const path = req.nextUrl.pathname;
  const routeKey = routeMap[path] || "general";

  const allowed = await checkRateLimit(ip, routeKey);

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "You have made too many requests." },
      { status: 429 }
    );
  }

  return null;
}