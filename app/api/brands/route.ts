//api/brands/route.ts
import prisma from "@/app/lib/prisma";
import { brandSchema } from "@/app/lib/validation/brand.schema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { querySchema } from "@/app/lib/validation/query.schema";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

const brandQuerySchema = querySchema.extend({
  includeItems: z.enum(["true", "false"]).default("false"),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = brandQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Bad request: parameters not valid.",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { page, limit, search, isActive, includeItems } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.BrandWhereInput = {};

    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isActive) where.isActive = isActive === "true";

    const include: Prisma.BrandInclude = {
      _count: {
        select: { sneakerModels: true },
      },
    };

    if (includeItems === "true") {
      include.sneakerModels = {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
        },
      };
    }

    const [brands, total] = await prisma.$transaction([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include,
      }),
      prisma.brand.count({ where }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[BRANDS_GET] Error:", error);
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
    const validation = brandSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const validatedData = validation.data;

    const existingBrand = await prisma.brand.findUnique({
      where: { name: validatedData.name },
    });

    if (existingBrand) {
      return NextResponse.json(
        { message: "Brand name already exists" },
        { status: 400 },
      );
    }

    const brand = await prisma.brand.create({
      data: validatedData,
      include: { _count: { select: { sneakerModels: true } } },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: unknown) {
    console.error("[BRANDS_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
