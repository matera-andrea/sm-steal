import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  params: Promise<{ itemId: string }>
) {
  try {
    const { itemId } = await params;
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Item photos fetched successfully",
        itemId,
        photos: item.photos,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in fetching item photos:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  params: Promise<{ itemId: string; }> 
) {
  try {
    const { itemId } = await params;

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }


    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const photoName = `i_${itemId}-p_${item.photos.length + 1}`;
    // crea la foto già associata al prodotto
    const newPhoto = await prisma.photo.create({
      data: {
        name: photoName,
        url: `https://example.com/photos/${photoName}.jpg`,
        order: item.photos.length + 1,
        productId: itemId,
      },
    });

    return NextResponse.json(
      {
        message: "Photo added to item successfully",
        itemId,
        newPhoto,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in adding photo to item:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
