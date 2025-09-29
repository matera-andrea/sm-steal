/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { itemSchema } from "@/app/lib/validation/item.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive =
      isActiveParam !== null ? isActiveParam === "true" : undefined;

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

    const items = await prisma.item.findMany({
      where: {
        ...(search && {
          name: { contains: search, mode: "insensitive" },
        }),
        ...(isActive !== undefined && { isActive }),
        ...(brandId && { brandId }),
        ...(category && { category }),
        ...(sku && { sku }),
        ...(gender && { gender }),
      },
    });

    return Response.json(items);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Errore nel recupero items" }),
      {
        status: 500,
      }
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
    const item = await prisma.item.create({
      data: validatedData,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
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
