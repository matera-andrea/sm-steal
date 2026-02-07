// /api/items/[id]/route.ts

import prisma from "@/app/lib/prisma";
import { updateItemSchema } from "@/app/lib/validation/item.schema";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ itemId: string }>;
}

//
// GET ITEM BY ID
//
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        sneakerModel: {
          include: {
            Brand: true,
          },
        },
        listings: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Articolo non trovato." },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("[ITEM_GET_BY_ID] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

//
// UPDATE ITEM BY ID
//
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const validation = updateItemSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation errors:", validation.error.issues);
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    // Controlla che l'item da aggiornare esista
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!existingItem) {
      return NextResponse.json(
        { message: "Articolo non trovato." },
        { status: 404 },
      );
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: validation.data,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("[ITEM_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

//
// DELETE ITEM BY ID
//
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Controlla che l'item da eliminare esista per ottenere l'ID del modello
    const { itemId } = await params;
    const itemToDelete = await prisma.item.findUnique({
      where: { id: itemId },
      select: { sneakerModelId: true },
    });

    if (!itemToDelete) {
      return NextResponse.json(
        { message: "Articolo non trovato." },
        { status: 404 },
      );
    }

    // Usa una transazione per eliminare l'item e decrementare il contatore
    await prisma.$transaction(async (tx) => {
      await tx.item.delete({
        where: { id: itemId },
      });

      await tx.sneakerModel.update({
        where: { id: itemToDelete.sneakerModelId },
        data: { itemsCount: { decrement: 1 } },
      });
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error("[ITEM_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
