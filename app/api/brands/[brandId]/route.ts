/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ZodError } from "zod";
import { brandSchema } from "@/app/lib/validation/brand.schema";

// GET brand by id
export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand non trovato" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error("Errore GET brand:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const body = await request.json();
    const parsed = brandSchema.parse(body);

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Errore PUT brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const body = await request.json();
    // per PATCH uso partial() dello schema
    const parsed = brandSchema.partial().parse(body);

    const updated = await prisma.brand.update({
      where: { id: params.brandId },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Errore PATCH brand:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    await prisma.brand.delete({
      where: { id: params.brandId },
    });

    return NextResponse.json({ message: "Brand eliminato" });
  } catch (error: any) {
    console.error("Errore DELETE brand:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
