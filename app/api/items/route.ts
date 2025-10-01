import prisma from "@/app/lib/prisma";
import { itemSchema } from "@/app/lib/validation/item.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  isActive: z.enum(["true", "false"]).optional(),
  includeListings: z.enum(["true", "false"]).default("false"),
  brandId: z.string().optional(),
  category: z
    .enum(["SNEAKER", "SHOE", "COLLECTIBLE", "CLOTHING", "ACCESSORY", "OTHER"])
    .optional(),
  sku: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      new URL(request.url).searchParams.entries()
    );
    const params = querySchema.parse(searchParams);

    const skip = (params.page - 1) * params.limit;
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }
    if (params.brandId) where.brandId = params.brandId;
    if (params.category) where.category = params.category;
    if (params.sku) where.sku = params.sku;
    if (params.gender) where.gender = params.gender;
    if (params.isActive) where.isActive = params.isActive === "true";

    const include =
      params.includeListings === "true"
        ? {
            listings: {
              where: { isActive: true },
              select: {
                id: true,
                description: true,
                condition: true,
                stock: true,
              },
            },
            _count: { select: { listings: true } },
          }
        : { _count: { select: { listings: true } } };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { name: "asc" },
        include,
      }),
      prisma.item.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const validatedData = itemSchema.parse(body);

    const existingItem = await prisma.item.findUnique({
      where: { name: validatedData.name },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Item name already exists" },
        { status: 400 }
      );
    }

    const [item] = await prisma.$transaction([
      prisma.item.create({ data: validatedData }),
      prisma.brand.update({
        where: { id: validatedData.brandId },
        data: { itemsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
