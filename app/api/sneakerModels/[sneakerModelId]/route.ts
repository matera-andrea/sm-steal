// /api/sneaker-models/[id]/route.ts

import prisma from "@/app/lib/prisma";
import { updateSneakerModelSchema } from "@/app/lib/validation/sneakerModel.schema";
import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

interface Params {
  params: Promise<{ sneakerModelId: string }>;
}

//
// GET SNEAKER MODEL BY ID
//
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const model = await prisma.sneakerModel.findUnique({
      where: { id: (await params).sneakerModelId },
      include: {
        Brand: true, // Include tutti i dati del brand
        items: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!model) {
      return NextResponse.json(
        { message: "Modello non trovato." },
        { status: 404 },
      );
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error("[SNEAKER_MODEL_GET_BY_ID] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

//
// UPDATE SNEAKER MODEL BY ID
//
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const body = await request.json();
    const validation = updateSneakerModelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    // Controlla che il modello da aggiornare esista
    const existingModel = await prisma.sneakerModel.findUnique({
      where: { id: (await params).sneakerModelId },
    });
    if (!existingModel) {
      return NextResponse.json(
        { message: "Modello non trovato." },
        { status: 404 },
      );
    }

    const updatedModel = await prisma.sneakerModel.update({
      where: { id: (await params).sneakerModelId },
      data: validation.data,
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error("[SNEAKER_MODEL_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

//
// DELETE SNEAKER MODEL BY ID
//
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    // Controlla che il modello esista per ottenere il brandId associato
    const modelToDelete = await prisma.sneakerModel.findUnique({
      where: { id: (await params).sneakerModelId },
      select: { brandId: true },
    });

    if (!modelToDelete) {
      return NextResponse.json(
        { message: "Modello non trovato." },
        { status: 404 },
      );
    }

    // Usa una transazione per eliminare il modello e decrementare il contatore del brand
    await prisma.$transaction(async (tx) => {
      // Nota: la relazione con `Item` ha `onDelete: Cascade`, quindi
      // eliminando il modello, verranno eliminati anche tutti gli `Item` associati.
      // Se questo non è il comportamento desiderato, la policy `onDelete`
      // nello schema Prisma andrebbe cambiata (es. `Restrict` o `SetNull`).
      await tx.sneakerModel.delete({
        where: { id: (await params).sneakerModelId },
      });

      await tx.brand.update({
        where: { id: modelToDelete.brandId },
        data: { itemsCount: { decrement: 1 } },
      });
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error("[SNEAKER_MODEL_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
