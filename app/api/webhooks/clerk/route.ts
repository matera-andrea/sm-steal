import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/app/lib/prisma";

type ClerkUserDeletedEvent = {
  type: "user.deleted";
  data: {
    id: string;
    deleted: boolean;
  };
};

type ClerkWebhookEvent = ClerkUserDeletedEvent | { type: string; data: unknown };

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[CLERK_WEBHOOK] CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // Verify signature via svix
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.deleted") {
    const { id: clerkUserId } = (event as ClerkUserDeletedEvent).data;

    if (!clerkUserId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    try {
      // Delete all WishlistItem records tied to this Clerk userId (PII erasure)
      const { count } = await prisma.wishlistItem.deleteMany({
        where: { userId: clerkUserId },
      });

      // Delete the User record if one exists (created via other webhooks)
      await prisma.user.deleteMany({
        where: { clerkId: clerkUserId },
      });

      console.info(
        `[CLERK_WEBHOOK] user.deleted: removed ${count} wishlist items for user ${clerkUserId}`,
      );

      return NextResponse.json({ deleted: true, wishlistItemsRemoved: count });
    } catch (error) {
      console.error("[CLERK_WEBHOOK] DB deletion failed:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }

  // Unhandled event types — return 200 to avoid Clerk retries
  return NextResponse.json({ received: true });
}
