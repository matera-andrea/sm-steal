//api/items/route.ts
import prisma from "@/app/lib/prisma";
import { createItemSchema } from "@/app/lib/validation/item.schema";
import { querySchema } from "@/app/lib/validation/query.schema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

const itemsQuerySchema = querySchema.extend({
  brandId: z.cuid().optional(),
  sneakerModelId: z.string().optional(),
  category: z
    .enum(["SNEAKER", "SHOE", "COLLECTIBLE", "CLOTHING", "ACCESSORY", "OTHER"])
    .optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = itemsQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Bad Request: parameters not valid",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      page,
      limit,
      search,
      isActive,
      brandId,
      sneakerModelId,
      category,
      gender,
    } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.ItemWhereInput = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isActive) where.isActive = isActive === "true";
    if (category) where.category = category;
    if (gender) where.gender = gender;
    if (sneakerModelId) where.sneakerModelId = sneakerModelId;
    if (brandId) {
      where.sneakerModel = { brandId: brandId };
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
          include: {
            sizings: {
              select: { price: true },
            },
          },
        },
      },
    });

    const itemsForClient = itemsFromDb.map((item) => {
      // Estraiamo tutti i prezzi da TUTTE le varianti di TUTTI i listing attivi dell'item
      const allPrices = item.listings.flatMap((l) =>
        l.sizings.map((s) => s.price),
      );

      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;
      const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : null;

      return {
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        gender: item.gender,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        sneakerModel: item.sneakerModel,
        minPrice,
        maxPrice,
        listingCount: item.listings.length,
      };
    });

    const total = await prisma.item.count({ where });

    return NextResponse.json({
      data: itemsForClient,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ITEMS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const body = await request.json();
    const validation = createItemSchema.safeParse(body);

    if (!validation.success) {
      console.log(validation.error);
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const { name, sneakerModelId, ...rest } = validation.data;

    const existingItem = await prisma.item.findUnique({ where: { name } });
    if (existingItem) {
      return NextResponse.json(
        { message: `L'articolo '${name}' esiste già.` },
        { status: 409 },
      );
    }

    const newItem = await prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: { name, sneakerModelId, ...rest },
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
