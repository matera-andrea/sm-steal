// /api/items/route.ts

import prisma from "@/app/lib/prisma";
import { createItemSchema } from "@/app/lib/validation/item.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema per la validazione dei parametri della query string
const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20), // Limite default ridotto
  isActive: z.enum(["true", "false"]).optional(),
  brandId: z.string().cuid("ID del brand non valido.").optional(),
  sneakerModelId: z.string().cuid("ID del modello non valido.").optional(),
  category: z
    .enum(["SNEAKER", "SHOE", "COLLECTIBLE", "CLOTHING", "ACCESSORY", "OTHER"])
    .optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]).optional(),
});

//
// GET ALL ITEMS (con filtri e paginazione)
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

    const params = validation.data;
    const {
      page,
      limit,
      search,
      isActive,
      brandId,
      sneakerModelId,
      category,
      gender,
    } = params;

    const skip = (page - 1) * limit;

    // Costruzione dinamica della clausola `where`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isActive) where.isActive = isActive === "true";
    if (category) where.category = category;
    if (gender) where.gender = gender;
    if (sneakerModelId) where.sneakerModelId = sneakerModelId;

    // FIX: Per filtrare per brandId, bisogna agire sul modello relazionato `sneakerModel`
    if (brandId) {
      where.sneakerModel = {
        ...where.sneakerModel,
        brandId: brandId,
      };
    }

    const itemsFromDb = await prisma.item.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        sneakerModel: {
          select: { name: true, Brand: { select: { name: true } } },
        },
        listings: {
          where: { isActive: true },
          select: { price: true }, // Non ci servono più le taglie qui
        },
        // FIX: Includiamo esplicitamente il conteggio degli wishlistItems
        _count: {
          select: { wishlistItems: true },
        },
      },
    });
    const itemsForClient = itemsFromDb.map((item) => {
      const { listings, _count, ...restOfItem } = item;

      // Calcoliamo il range di prezzo
      const prices = listings.map((l) => l.price);
      const minPrice = listings.length > 0 ? Math.min(...prices) : null;
      const maxPrice = listings.length > 0 ? Math.max(...prices) : null;

      // La prop `availableSizesCount` non è più necessaria qui perché la gestiamo nel modale.
      // Includiamo i conteggi con nomi chiari.
      return {
        ...restOfItem,
        minPrice,
        maxPrice,
        // Usiamo il conteggio dei listing ATTIVI che abbiamo recuperato
        listingCount: listings.length,
        // Usiamo il conteggio dalla relazione _count
        wishlistItemsCount: _count?.wishlistItems ?? 0,
      };
    });

    const total = await prisma.item.count({ where });

    return NextResponse.json({
      data: itemsForClient, // Invia i dati mappati
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ITEMS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// CREATE ITEM
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, sneakerModelId, ...rest } = validation.data;

    // Controllo se esiste già un item con lo stesso nome
    const existingItem = await prisma.item.findUnique({ where: { name } });
    if (existingItem) {
      return NextResponse.json(
        { message: `Un articolo con il nome '${name}' esiste già.` },
        { status: 409 }
      ); // 409 Conflict
    }

    // Controllo se il sneakerModelId fornito esiste
    const sneakerModelExists = await prisma.sneakerModel.findUnique({
      where: { id: sneakerModelId },
    });
    if (!sneakerModelExists) {
      return NextResponse.json(
        {
          message: `Il modello di sneaker con ID '${sneakerModelId}' non è stato trovato.`,
        },
        { status: 404 }
      );
    }

    // Esecuzione della creazione e dell'aggiornamento del contatore in una transazione
    const newItem = await prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: {
          name,
          sneakerModelId,
          ...rest,
        },
      });

      await tx.sneakerModel.update({
        where: { id: sneakerModelId },
        data: { itemsCount: { increment: 1 } },
      });

      return item;
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("[ITEMS_POST] Error:", error);
    if (error instanceof z.ZodError) {
      // Questo check ora è ridondante con safeParse ma lo teniamo per sicurezza
      return NextResponse.json(
        { message: "Validation error", errors: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
