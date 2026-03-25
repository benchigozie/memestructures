import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rateLimitMiddleware";
import { loggerMiddleware } from "@/lib/middleware/loggerMiddleware";

export async function middleware(req: NextRequest) {

  const logger = loggerMiddleware(req);
  if (logger) return logger;

  const rateLimit = await rateLimitMiddleware(req);
  if (rateLimit) return rateLimit;

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/user/:path*", "/api/lead/:path*"],
};