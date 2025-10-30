import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/wishlist(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Se è una route protetta
  if (isProtectedRoute(req)) {
    // Se non autenticato → blocca
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Controlla se è admin
    const adminId = process.env.ADMIN_ID;

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (userId !== adminId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    }
  }

  // Tutto ok → continua
  return;
});

export const config = {
  matcher: [
    // Skip internals/static
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
