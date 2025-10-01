import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ZodError } from "zod";
import { itemSchema } from "@/app/lib/validation/item.schema";

type RouteParams = { params: { itemId: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error: unknown) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const parsed = itemSchema.parse(body);

    const updated = await prisma.item.update({
      where: { id: params.itemId },
      data: parsed,
    });

    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const parsed = itemSchema.partial().parse(body);

    const updated = await prisma.item.update({
      where: { id: params.itemId },
      data: parsed,
    });

    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error patching item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.item.delete({
      where: { id: params.itemId },
    });

    // 204 = No Content → niente body
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
