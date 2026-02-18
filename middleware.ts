import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const isWishlistRoute = createRouteMatcher(["/wishlist(.*)"]);

const isPublicWebhook = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/contact(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;
  const method = req.method;
  const adminId = process.env.ADMIN_ID;
  const devId = process.env.DEV_ID;
  const isAdmin = userId === adminId || userId === devId;

  // 1. Rate limiting (API only)
  if (path.startsWith("/api")) {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "127.0.0.1";
    const { success, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "X-RateLimit-Reset": reset.toString() } },
      );
    }
  }

  // 2. Mutating API protection
  if (path.startsWith("/api")) {
    const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);

    if (!isSafeMethod && !isPublicWebhook(req)) {
      if (!userId || !isAdmin) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 },
        );
      }

      // CORS origin check — exact match
      const origin = req.headers.get("origin");
      const host = req.headers.get("host");

      if (origin && host) {
        const allowedOrigins = [
          `https://${host}`,
          `http://${host}`,
          "http://localhost:3000",
        ];
        if (!allowedOrigins.includes(origin)) {
          return NextResponse.json({ error: "Bad Origin" }, { status: 403 });
        }
      }
    }
  }

  // 3. Admin pages protection
  if (path.startsWith("/admin")) {
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  // 4. Wishlist protection
  if (isWishlistRoute(req)) {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
