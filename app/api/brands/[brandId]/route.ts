import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ZodError } from "zod";
import { brandSchema } from "@/app/lib/validation/brand.schema";

type RouteParams = { params: Promise<{ brandId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { brandId } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ data: brand });
  } catch (error: unknown) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const parsed = brandSchema.parse(body);
    const { brandId } = await params;

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: parsed,
    });

    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 },
      );
    }
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { brandId } = await params;

    const parsed = brandSchema.partial().parse(body);

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: parsed,
    });

    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 },
      );
    }
    console.error("Error patching brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { brandId } = await params;

    await prisma.brand.delete({
      where: { id: brandId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
