// /api/listings/route.ts

import prisma from "@/app/lib/prisma";
import { createListingSchema } from "@/app/lib/validation/listing.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema di validazione per i parametri della query
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  isActive: z.enum(["true", "false"]).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  itemId: z.string().cuid().optional(),
  condition: z
    .enum(["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE", "POOR"])
    .optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

//
// GET ALL LISTINGS (con filtri e paginazione)
//
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = querySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Parametri di ricerca non validi",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      isActive,
      isFeatured,
      itemId,
      condition,
      minPrice,
      maxPrice,
    } = validation.data;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (isActive) where.isActive = isActive === "true";
    if (isFeatured) where.isFeatured = isFeatured === "true";
    if (itemId) where.itemId = itemId;
    if (condition) where.condition = condition;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [listings, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          item: { select: { id: true, name: true, sku: true } },
          sizings: { include: { sizing: true } }, // Include le taglie associate
          _count: { select: { photos: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      data: listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[LISTINGS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// CREATE A NEW LISTING
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { itemId, sizingIds, ...listingData } = validation.data;

    // Controlla che l'item associato esista
    const itemExists = await prisma.item.findUnique({ where: { id: itemId } });
    if (!itemExists) {
      return NextResponse.json(
        { message: `L'articolo con ID '${itemId}' non esiste.` },
        { status: 404 }
      );
    }

    // Crea il listing, le sue associazioni con le taglie e aggiorna il contatore dell'item
    const newListing = await prisma.$transaction(async (tx) => {
      const createdListing = await tx.listing.create({
        data: {
          ...listingData,
          itemId,
        },
      });

      // Crea le righe nella tabella di join `ListingSizing`
      await tx.listingSizing.createMany({
        data: sizingIds.map((sizingId) => ({
          listingId: createdListing.id,
          sizingId: sizingId,
        })),
      });

      // Aggiorna il contatore degli annunci sull'item
      await tx.item.update({
        where: { id: itemId },
        data: { listingCount: { increment: 1 } },
      });

      return createdListing;
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("[LISTINGS_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
