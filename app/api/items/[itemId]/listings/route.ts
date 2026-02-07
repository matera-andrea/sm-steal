// app/api/items/[id]/listings/route.ts

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ itemId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params;

    const itemExists = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!itemExists) {
      return NextResponse.json({ message: `Item not found.` }, { status: 404 });
    }
    const listings = await prisma.listing.findMany({
      where: {
        itemId: itemId,
      },
      include: {
        sizings: {
          include: {
            sizing: true,
          },
        },
        photos: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error(`[API ERROR] GET /api/items/[id]/listings:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
