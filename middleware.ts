import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- CONFIGURAZIONE UPSTASH ---
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(1000, "5 s"),
//   analytics: true,
//   prefix: "@upstash/ratelimit",
// });

// --- DEFINIZIONE ROTTE ---
// Wishlist rimane protetta per utenti loggati (qualsiasi)
const isWishlistRoute = createRouteMatcher(["/wishlist(.*)"]);

// Webhooks: Eccezioni che DEVONO essere pubbliche anche in POST (es. Stripe o Clerk)
// Aggiungi qui eventuali path che devono ricevere dati dall'esterno senza essere Admin
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

  // ---------------------------------------------------------
  // 1. RATE LIMITING (Solo API)
  // // ---------------------------------------------------------
  // if (path.startsWith("/api")) {
  //   const ip =
  //     req.headers.get("x-forwarded-for") ??
  //     req.headers.get("x-real-ip") ??
  //     "127.0.0.1";
  //   const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  //   if ((!success && !userId) || (userId !== adminId && userId !== devId)) {
  //     return NextResponse.json(
  //       { error: "Too Many Requests", message: "Rallenta! Troppe richieste." },
  //       { status: 429, headers: { "X-RateLimit-Reset": reset.toString() } },
  //     );
  //   }
  // }

  // ---------------------------------------------------------
  // 2. PROTEZIONE AUTOMATICA METODI (La parte che hai chiesto)
  // ---------------------------------------------------------
  // Se stiamo chiamando un'API
  if (path.startsWith("/api")) {
    // Definiamo i metodi "sicuri" (sola lettura)
    const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);

    // Se il metodo NON è sicuro (quindi è POST, PUT, DELETE...)
    // E NON è un webhook pubblico esplicitamente escluso
    if (!isSafeMethod && !isPublicWebhook(req)) {
      // Se non sei loggato o non sei l'admin o dev -> BLOCCA
      if (!userId || (userId !== adminId && userId !== devId)) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "Solo l'Admin o il Dev può modificare i dati.",
          },
          { status: 403 },
        );
      }
      // Nel middleware, dentro il blocco che controlla le API POST/PUT/DELETE
      const origin = req.headers.get("origin");
      const host = req.headers.get("host"); // es: smsteal.com

      // Se c'è un'origine e non corrisponde al tuo host (o localhost in dev)
      if (origin && !origin.includes(host!) && !origin.includes("localhost")) {
        return NextResponse.json({ error: "Bad Origin" }, { status: 403 });
      }
    }
  }

  // ---------------------------------------------------------
  // 3. ALTRE PROTEZIONI (Pagine Frontend)
  // ---------------------------------------------------------

  // Protezione Dashboard Admin (Pagine UI, non API)
  if (path.startsWith("/admin")) {
    if (userId !== process.env.ADMIN_ID && userId !== process.env.DEV_ID) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  if (isWishlistRoute(req)) {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  // Protezione Wishlist (Utenti loggati)
  // if (isWishlistRoute(req)) {
  //   if (!userId) {
  //     return auth.redirectToSignIn();
  //   }
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
