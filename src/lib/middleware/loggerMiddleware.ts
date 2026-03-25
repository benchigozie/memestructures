import { NextRequest } from "next/server";

export function loggerMiddleware(req: NextRequest) {

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "local";

  console.log(`Incoming request from IP: ${ip} to ${req.nextUrl.pathname}`);

  return null;
}