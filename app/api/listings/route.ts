import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { createListingSchema } from "@/app/lib/validation/listing.schema";
import { querySchema } from "@/app/lib/validation/query.schema";

// --- AGGIORNAMENTO SCHEMA VALIDAZIONE QUERY ---
const emptyToUndefined = z.preprocess((val) => (val === "" ? undefined : val), z.string().optional());

const listingQuerySchema = querySchema.extend({
  isActive: z.preprocess((val) => (val === "" ? undefined : val), z.enum(["true", "false"]).optional()),
  isFeatured: z.preprocess((val) => (val === "" ? undefined : val), z.enum(["true", "false"]).optional()),
  itemId: emptyToUndefined,
  condition: z.preprocess((val) => (val === "" ? undefined : val), z.enum(["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE", "POOR"]).optional()),
  minPrice: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(0).optional()),
  maxPrice: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().positive().optional()),
  sizingIds: emptyToUndefined,
  search: emptyToUndefined,
  brandId: emptyToUndefined,
  modelId: emptyToUndefined,
  sortBy: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["featured", "alphabetical", "price_asc", "price_desc"]).default("featured"),
  ),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = listingQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Parametri non validi", errors: validation.error.issues },
        { status: 400 },
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
      sizingIds,
      search,
      brandId,
      modelId,
      sortBy,
    } = validation.data;

    const skip = (page - 1) * limit;

    // --- COSTRUZIONE QUERY DINAMICA ---
    const where: Prisma.ListingWhereInput = {};

    if (isActive) where.isActive = isActive === "true";
    if (isFeatured) where.isFeatured = isFeatured === "true";

    // --- FILTRI SULL'ITEM ---
    const itemWhere: Prisma.ItemWhereInput = {};

    if (itemId) itemWhere.id = itemId;
    if (modelId) itemWhere.sneakerModelId = modelId;
    if (brandId) {
      itemWhere.sneakerModel = { brandId: brandId };
    }

    if (search) {
      const searchFilter = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
      itemWhere.OR = [
        { name: searchFilter },
        { sku: searchFilter },
        { sneakerModel: { name: searchFilter } },
        {
          sneakerModel: {
            Brand: {
              name: searchFilter,
            },
          },
        },
      ];
    }

    if (Object.keys(itemWhere).length > 0) {
      where.item = itemWhere;
    }

    // --- FILTRI VARIANTI (Prezzo e Condizione) ---
    const sizingIdList = sizingIds?.split(",").filter(Boolean) ?? [];

    if (
      condition ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      sizingIdList.length > 0
    ) {
      where.sizings = {
        some: {
          ...(condition && { condition }),
          ...(sizingIdList.length > 0 && { sizingId: { in: sizingIdList } }),
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        },
      };
    }

    const listingInclude = {
      item: {
        include: {
          sneakerModel: {
            include: { Brand: true },
          },
        },
      },
      sizings: {
        include: { sizing: true },
        orderBy: { price: "asc" as const },
      },
      photos: {
        orderBy: [{ isMain: "desc" as const }, { order: "asc" as const }],
        select: { id: true, url: true, isMain: true, order: true },
      },
    };

    type ListingResult = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;
    let listings: ListingResult[];
    let total: number;

    if (sortBy === "featured") {
      // Compound index: (isActive, isFeatured, hasStock, createdAt) — zero sort step
      [listings, total] = (await prisma.$transaction([
        prisma.listing.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { isFeatured: "desc" },
            { hasStock: "desc" },
            { createdAt: "desc" },
          ],
          include: listingInclude,
        }),
        prisma.listing.count({ where }),
      ])) as [ListingResult[], number];
    } else if (sortBy === "alphabetical") {
      [listings, total] = (await prisma.$transaction([
        prisma.listing.findMany({
          where,
          skip,
          take: limit,
          orderBy: { item: { sneakerModel: { name: "asc" } } },
          include: listingInclude,
        }),
        prisma.listing.count({ where }),
      ])) as [ListingResult[], number];
    } else {
      // Price sort: use groupBy to find the min/max price per listing in the DB
      type GroupedRow = { listingId: string; _min: { price: number | null }; _max: { price: number | null } };
      const grouped = (await prisma.listingSizing.groupBy({
        by: ["listingId"] as const,
        where: { listing: where },
        _min: { price: true },
        _max: { price: true },
        orderBy:
          sortBy === "price_asc"
            ? { _min: { price: "asc" } }
            : { _max: { price: "desc" } },
      })) as GroupedRow[];

      total = grouped.length;
      const pageIds = grouped.slice(skip, skip + limit).map((g) => g.listingId);

      const unordered = await prisma.listing.findMany({
        where: { id: { in: pageIds } },
        include: listingInclude,
      });

      // Restore the DB-sorted order after findMany
      listings = pageIds
        .map((id) => unordered.find((l) => l.id === id))
        .filter((l): l is NonNullable<typeof l> => l !== undefined);
    }

    return NextResponse.json({
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[LISTINGS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// --- POST: CREA O AGGIORNA (MERGE) LISTING ---
export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;

    const body = await request.json();

    const validation = createListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    // Estraniamo 'stock' per ignorarlo, visto che non esiste più sul Listing padre
    const { itemId, variants, ...listingData } = validation.data;

    // 2. Verifica esistenza Item
    const itemExists = await prisma.item.findUnique({ where: { id: itemId } });
    if (!itemExists) {
      return NextResponse.json(
        { message: "L'articolo selezionato non esiste." },
        { status: 404 },
      );
    }

    // 3. Verifica esistenza Listing "Padre"
    const existingListing = await prisma.listing.findFirst({
      where: { itemId: itemId },
    });

    // 4. Transazione Atomica
    const result = await prisma.$transaction(async (tx) => {
      // === SCENARIO A: LISTING ESISTENTE (MERGE/UPDATE) ===
      if (existingListing) {
        // A.1 Aggiorna dati generali
        await tx.listing.update({
          where: { id: existingListing.id },
          data: {
            ...listingData,
            updatedAt: new Date(),
            // RIMOSSO: stock
          },
        });

        // A.2 Gestione Varianti
        for (const variant of variants) {
          await tx.listingSizing.upsert({
            where: {
              listingId_sizingId_condition: {
                listingId: existingListing.id,
                sizingId: variant.sizingId,
                condition: variant.condition,
              },
            },
            update: {
              // IMPORTANTE: Conversione in Decimal per il DB
              price: variant.price,
              stock: variant.stock ?? 1,
            },
            create: {
              listingId: existingListing.id,
              sizingId: variant.sizingId,
              condition: variant.condition,
              price: variant.price,
              stock: variant.stock ?? 1,
            },
          });
        }

        // RIMOSSO: Calcolo aggregato e update stock sul padre

        // Sync hasStock: true if any sizing still has stock > 0
        const stockAgg = await tx.listingSizing.aggregate({
          where: { listingId: existingListing.id },
          _sum: { stock: true },
        });
        await tx.listing.update({
          where: { id: existingListing.id },
          data: { hasStock: (stockAgg._sum.stock ?? 0) > 0 },
        });

        // Ritorna l'oggetto aggiornato
        const updatedListing = await tx.listing.findUnique({
          where: { id: existingListing.id },
          include: { sizings: true },
        });

        return { action: "updated", listing: updatedListing };
      }

      // === SCENARIO B: NUOVO LISTING (CREATE) ===
      else {
        // B.1 Creazione Listing (senza stock padre)
        const createdListing = await tx.listing.create({
          data: {
            ...listingData,
            itemId,
            // RIMOSSO: stock
            sizings: {
              create: variants.map((v) => ({
                sizingId: v.sizingId,
                price: v.price,
                condition: v.condition,
                stock: v.stock ?? 1,
              })),
            },
          },
        });

        // B.2 Aggiornamento contatore sull'Item
        await tx.item.update({
          where: { id: itemId },
          data: { listingCount: { increment: 1 } },
        });

        return { action: "created", listing: createdListing };
      }
    });

    return NextResponse.json(result.listing, {
      status: result.action === "created" ? 201 : 200,
    });
  } catch (error) {
    console.error("[LISTINGS_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
