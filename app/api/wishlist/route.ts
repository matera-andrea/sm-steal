import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

// Schema per validare il body del POST
const toggleSchema = z.object({
  listingId: z.string().cuid(),
});

// 1. GET: Ottieni tutti i listing nella wishlist dell'utente loggato
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ data: [] }, { status: 200 }); // Ritorna array vuoto se non loggato
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            item: { include: { sneakerModel: { include: { Brand: true } } } },
            photos: { where: { isMain: true } },
            sizings: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Ritorniamo direttamente i listings per comodità nel frontend
    const listings = wishlist.map((w) => w.listing);

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

// 2. POST: Toggle (Aggiungi se non c'è, Rimuovi se c'è)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = toggleSchema.parse(body);

    // Controlla se esiste già
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existingItem) {
      // RIMUOVI
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      return NextResponse.json({ action: "removed" });
    } else {
      // AGGIUNGI
      await prisma.wishlistItem.create({
        data: {
          userId,
          listingId,
        },
      });
      return NextResponse.json({ action: "added" });
    }
  } catch (error) {
    console.error("[WISHLIST_TOGGLE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
