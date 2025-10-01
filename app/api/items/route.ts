/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { itemSchema } from "@/app/lib/validation/item.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const isActive = searchParams.get("isActive");
    const skip = (page - 1) * limit;
    const includeListing =
      searchParams.get("includeListings") === "true" || false;
    const brandId = searchParams.get("brandId") || undefined;
    const category = searchParams.get("category") as
      | "SNEAKER"
      | "SHOE"
      | "COLLECTIBLE"
      | "CLOTHING"
      | "ACCESSORY"
      | "OTHER";
    const sku = searchParams.get("sku") || undefined;

    const gender = searchParams.get("gender") as
      | "MEN"
      | "WOMEN"
      | "UNISEX"
      | "KIDS";

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
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: includeListing
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
              _count: {
                select: { listings: true },
              },
            }
          : {
              _count: {
                select: { listings: true },
              },
            },
      }),
      prisma.item.count({ where }),
    ]);

    return Response.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching items: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const [item, _] = await prisma.$transaction([
      prisma.item.create({
        data: validatedData,
      }),
      prisma.brand.update({
        where: { id: validatedData.brandId },
        data: { itemsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
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
