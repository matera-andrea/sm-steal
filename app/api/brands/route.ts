import prisma from "@/app/lib/prisma";
import { brandSchema } from "@/app/lib/validation/brand.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  includeItems: z.enum(["true", "false"]).default("false"),
});

export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      new URL(request.url).searchParams.entries()
    );
    const params = querySchema.parse(rawParams);

    const skip = (params.page - 1) * params.limit;
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }
    if (params.isActive) {
      where.isActive = params.isActive === "true";
    }

    const include =
      params.includeItems === "true"
        ? {
            items: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                category: true,
                gender: true,
              },
            },
            _count: { select: { items: true } },
          }
        : { _count: { select: { items: true } } };

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { name: "asc" },
        include,
      }),
      prisma.brand.count({ where }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit),
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// POST brand
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = brandSchema.parse(body);

    const existingBrand = await prisma.brand.findUnique({
      where: { name: validatedData.name },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Brand name already exists" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: validatedData,
      include: { _count: { select: { items: true } } },
    });

    return NextResponse.json({ data: brand }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
