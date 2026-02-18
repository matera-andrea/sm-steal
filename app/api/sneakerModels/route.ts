// app/api/sneakerModels/route.ts
import prisma from "@/app/lib/prisma";
import { querySchema } from "@/app/lib/validation/query.schema";
import { createSneakerModelSchema } from "@/app/lib/validation/sneakerModel.schema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

const sneakerModelsQuerySchema = querySchema.extend({
  brandId: z.cuid("ID del brand non valido.").optional(),
});

// GET ALL SNEAKER MODELS
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = sneakerModelsQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Parametri non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const { page, limit, search, isActive, brandId } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.SneakerModelWhereInput = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isActive) where.isActive = isActive === "true";
    if (brandId) where.brandId = brandId;

    const [sneakerModels, total] = await prisma.$transaction([
      prisma.sneakerModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          Brand: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
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
      { status: 500 },
    );
  }
}

// CREATE SNEAKER MODEL
export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const body = await request.json();
    const validation = createSneakerModelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const { name, brandId, ...rest } = validation.data;

    // Verifica esistenza duplicato
    const existingModel = await prisma.sneakerModel.findUnique({
      where: { name },
    });
    if (existingModel) {
      return NextResponse.json(
        { message: `Il modello '${name}' esiste già.` },
        { status: 409 },
      );
    }

    // Verifica esistenza Brand
    const brandExists = await prisma.brand.findUnique({
      where: { id: brandId },
    });
    if (!brandExists) {
      return NextResponse.json(
        { message: "Brand di riferimento non trovato." },
        { status: 404 },
      );
    }

    const newModel = await prisma.$transaction(async (tx) => {
      const model = await tx.sneakerModel.create({
        data: { name, brandId, ...rest },
        include: { Brand: true },
      });

      // Aggiorniamo il contatore globale del Brand (itemsCount o modelsCount a seconda del tuo naming)
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
      { status: 500 },
    );
  }
}
