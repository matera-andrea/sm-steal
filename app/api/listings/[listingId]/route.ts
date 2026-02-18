import prisma from "@/app/lib/prisma";
import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { updateListingSchema } from "@/app/lib/validation/listing.schema";
import { ListingCondition } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ listingId: string }>;
}

interface Variant {
  sizingId: string;
  price: number;
  condition: ListingCondition;
  stock?: number;
}

// GET: Recupera il listing con tutte le varianti di prezzo/taglia
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { listingId } = await params;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        item: {
          include: {
            sneakerModel: { include: { Brand: true } },
          },
        },
        photos: { orderBy: { order: "asc" } },
        // Fondamentale: includiamo price e condition che ora sono qui
        sizings: {
          include: { sizing: true },
          orderBy: { sizing: { size: "asc" } }, // Ordiniamo per taglia
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 },
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[LISTING_GET_BY_ID] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH: Aggiorna il listing e le sue varianti specifiche
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;

    const { listingId } = await params;
    const body = await request.json();

    // NOTA: Dovrai aggiornare lo schema Zod per accettare un array di oggetti:
    // { sizingId: string, price: number, condition: Condition }
    const validation = updateListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 },
      );
    }

    // Estraiamo le varianti dal body (es: variants: [{ sizingId: '...', price: 200, condition: 'NEW' }])
    const { variants, ...listingData } = validation.data;
    const updatedListing = await prisma.$transaction(async (tx) => {
      const listing = await tx.listing.update({
        where: { id: listingId },
        data: listingData,
      });

      // 2. Se vengono passate varianti, resettiamo e ricreiamo
      if (variants) {
        // Rimuoviamo le vecchie associazioni taglia/prezzo
        await tx.listingSizing.deleteMany({
          where: { listingId: listingId },
        });

        // Creiamo le nuove associazioni con i relativi prezzi e condizioni
        await tx.listingSizing.createMany({
          data: variants.map((v: Variant) => ({
            listingId: listingId,
            sizingId: v.sizingId,
            price: v.price,
            condition: v.condition,
            stock: v.stock ?? 1,
          })),
        });
      }
      return listing;
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("[LISTING_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE rimane sostanzialmente invariata perché Prisma gestisce il Cascade
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;

    const { listingId } = await params;
    const listingToDelete = await prisma.listing.findFirst({
      where: { id: listingId },
      select: { itemId: true },
    });

    if (!listingToDelete) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.listing.delete({ where: { id: listingId } });
      await tx.item.update({
        where: { id: listingToDelete.itemId },
        data: { listingCount: { decrement: 1 } },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LISTING_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
