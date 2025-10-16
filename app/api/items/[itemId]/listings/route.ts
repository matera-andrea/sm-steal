// app/api/items/[id]/listings/route.ts

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { itemId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params;

    // Controlla se l'item esiste prima di procedere
    const itemExists = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!itemExists) {
      return NextResponse.json(
        { message: `Item with ID ${itemId} not found.` },
        { status: 404 }
      );
    }

    // Recupera tutti i listing per l'itemId specificato
    const listings = await prisma.listing.findMany({
      where: {
        itemId: itemId,
      },
      // Includi le relazioni necessarie per la visualizzazione nel frontend
      include: {
        sizings: {
          // Per ogni relazione nella tabella di giunzione, includi i dati completi della taglia
          include: {
            sizing: true,
          },
        },
        // Potresti voler includere anche le foto se il modale le mostra
        // photos: {
        //   orderBy: { order: 'asc' }
        // }
      },
      orderBy: {
        createdAt: "desc", // Ordina i listing dal più recente al più vecchio
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error(`[API ERROR] GET /api/items/[id]/listings:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
