/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { brandSchema } from "@/app/lib/validation/brand.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const standardBrandFetchingNumber = 10;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(
      searchParams.get("limit") || String(standardBrandFetchingNumber)
    );
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const includeItems = searchParams.get("includeItems") === "true" || false;
    const skip = (page - 1) * limit;

    // Costruisci il filtro where
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Query per ottenere i brand
    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: includeItems
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
              _count: {
                select: { items: true },
              },
            }
          : {
              _count: {
                select: { items: true },
              },
            },
      }),
      prisma.brand.count({ where }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
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
