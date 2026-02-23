import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

export async function GET(req: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;

    const wishlistItems = await prisma.wishlistItem.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: {
            item: {
              include: {
                sneakerModel: { include: { Brand: true } },
              },
            },
            photos: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });

    // 3. Estrai gli ID utente unici per chiedere i dati a Clerk
    const userIds = Array.from(new Set(wishlistItems.map((w) => w.userId)));

    // 4. Recupera i dati utenti da Clerk
    // Nota: clerkClient è asincrono. Recuperiamo la lista utenti filtrando per gli ID che abbiamo.
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({
      userId: userIds,
      limit: 100,
    });

    const users = usersResponse.data;

    // 5. Unisci i dati (Merge)
    const enrichedWishlist = wishlistItems.map((wishItem) => {
      const user = users.find((u) => u.id === wishItem.userId);

      // Costruiamo il nome completo del prodotto
      const brand = wishItem.listing.item.sneakerModel.Brand.name;
      const model = wishItem.listing.item.sneakerModel.name;
      const itemName = wishItem.listing.item.name;
      let displayName = `${brand} ${model}`;
      if (itemName.startsWith(model)) {
        const extra = itemName.slice(model.length).trim();
        if (extra) displayName += ` ${extra}`;
      }

      return {
        id: wishItem.id,
        addedAt: wishItem.createdAt,
        user: {
          id: wishItem.userId,
          fullName: user
            ? `${user.firstName} ${user.lastName}`
            : "Utente Sconosciuto",
          email: user?.emailAddresses[0]?.emailAddress || "N/A",
          imageUrl: user?.imageUrl || "",
        },
        product: {
          id: wishItem.listing.item.slug || wishItem.listing.id,
          name: displayName,
          sku: wishItem.listing.item.sku,
          imageUrl: wishItem.listing.photos[0]?.url || "/placeholder.png",
        },
      };
    });

    return NextResponse.json(enrichedWishlist);
  } catch (error) {
    console.error("[ADMIN_WISHLIST_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
