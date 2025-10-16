// /api/sneaker-models/route.ts

import prisma from "@/app/lib/prisma";
import { createSneakerModelSchema } from "@/app/lib/validation/sneakerModel.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema per la validazione dei parametri della query string
const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  isActive: z.enum(["true", "false"]).optional(),
  brandId: z.string().cuid("ID del brand non valido.").optional(),
});

//
// GET ALL SNEAKER MODELS (con filtri e paginazione)
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
    const { page, limit, search, isActive, brandId } = params;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isActive) where.isActive = isActive === "true";
    if (brandId) where.brandId = brandId;

    const include = {
      Brand: {
        select: { id: true, name: true },
      },
      _count: {
        select: { items: true },
      },
    };

    const [sneakerModels, total] = await prisma.$transaction([
      prisma.sneakerModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include,
      }),
      prisma.sneakerModel.count({ where }),
    ]);

    return NextResponse.json({
      data: sneakerModels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[SNEAKER_MODELS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// CREATE SNEAKER MODEL
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createSneakerModelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, brandId, ...rest } = validation.data;

    // Controllo se esiste già un modello con lo stesso nome
    const existingModel = await prisma.sneakerModel.findUnique({
      where: { name },
    });
    if (existingModel) {
      return NextResponse.json(
        { message: `Un modello con il nome '${name}' esiste già.` },
        { status: 409 }
      );
    }

    // Controllo che il brand esista prima di creare il modello
    const brandExists = await prisma.brand.findUnique({
      where: { id: brandId },
    });
    if (!brandExists) {
      return NextResponse.json(
        { message: `Il brand con ID '${brandId}' non è stato trovato.` },
        { status: 404 }
      );
    }

    const newModel = await prisma.$transaction(async (tx) => {
      const model = await tx.sneakerModel.create({
        data: {
          name,
          brandId,
          ...rest,
        },
      });

      // Incrementa il contatore dei modelli nel brand corrispondente
      await tx.brand.update({
        where: { id: brandId },
        data: { itemsCount: { increment: 1 } },
      });

      return model;
    });

    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error("[SNEAKER_MODELS_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
