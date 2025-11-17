import prisma from "@/app/lib/prisma";
import { updateListingSchema } from "@/app/lib/validation/listing.schema";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { listingId: string };
}

//
// GET A SINGLE LISTING BY ID
//
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const {listingId} = await params;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        item: {
          include: {
            sneakerModel: { include: { Brand: true } },
          },
        },
        photos: { orderBy: { order: "asc" } },
        sizings: { include: { sizing: true } },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[LISTING_GET_BY_ID] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// UPDATE A LISTING BY ID
//
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { listingId } = params;
    const body = await request.json();
    const validation = updateListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 }
      );
    }

    // Controlla che il listing da aggiornare esista
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!existingListing) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 }
      );
    }

    const { sizingIds, ...listingData } = validation.data;

    const updatedListing = await prisma.$transaction(async (tx) => {
      // 1. Aggiorna i dati principali del listing
      const listing = await tx.listing.update({
        where: { id: listingId },
        data: listingData,
      });

      // 2. Se vengono passate nuove taglie, sostituisci le vecchie
      if (sizingIds) {
        // Elimina le associazioni esistenti
        await tx.listingSizing.deleteMany({
          where: { listingId: listingId },
        });
        // Crea le nuove associazioni
        await tx.listingSizing.createMany({
          data: sizingIds.map((sizingId) => ({
            listingId: listingId,
            sizingId: sizingId,
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
      { status: 500 }
    );
  }
}

//
// DELETE A LISTING BY ID
//
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { listingId } = await params;
    const listingToDelete = await prisma.listing.findFirst({
      where: { id: listingId },
      select: { itemId: true },
    });

    if (!listingToDelete) {
      return NextResponse.json(
        { message: "Annuncio non trovato." },
        { status: 404 }
      );
    }

    // Prisma gestirà l'eliminazione a cascata di `Photo` e `ListingSizing`.
    // Dobbiamo solo preoccuparci di aggiornare il contatore.
    await prisma.$transaction(async (tx) => {
      await tx.listing.delete({
        where: { id: listingId },
      });

      await tx.item.update({
        where: { id: listingToDelete.itemId },
        data: { listingCount: { decrement: 1 } },
      });
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("[LISTING_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
