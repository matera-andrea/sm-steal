import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  params: Promise<{ itemId: string; photoId: string }>
) {
  try {
    const { itemId, photoId } = await params;
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    if (!photoId) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }
    // controlla che l'item esista
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const photo = item.photos.find((p) => p.id === photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Item photo fetched successfully",
        itemId,
        photo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in fetching item photo:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  params: Promise<{ itemId: string; photoId: string }>
) {
  try {
    const { itemId, photoId } = await params;
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    if (!photoId) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }
    // controlla che l'item esista
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const photo = item.photos.find((p) => p.id === photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    await prisma.photo.delete({ where: { id: photoId } });
    return NextResponse.json(
      { message: "Photo deleted successfully", itemId, photoId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in deleting item photo:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } 
}

export async function PATCH(
  request: NextRequest,
  params: Promise<{ itemId: string; photoId: string }>
) {
  try {
    const { itemId, photoId } = await params;
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    if (!photoId) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }
    const { name, url, order } = await request.json();
    if (!name && !url && !order) {
      return NextResponse.json(
        { error: "At least one field (name, url, order) is required to update" },
        { status: 400 }
      );
    }
    // controlla che l'item esista
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const photo = item.photos.find((p) => p.id === photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        name: name || photo.name,
        url: url || photo.url,
        order: order || photo.order
      },
    });
    return NextResponse.json(
      { message: "Photo updated successfully", itemId, photo: updatedPhoto },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updating item photo:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  params: Promise<{ itemId: string; photoId: string }>
) {
  PATCH(request, params);
}