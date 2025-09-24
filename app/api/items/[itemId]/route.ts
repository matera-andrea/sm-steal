import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
        });
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        return NextResponse.json(
            {
                message: "Item fetched successfully",
                item,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in fetching item by ID:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, params: Promise<{ itemId: string }>) {
    try {
        const { itemId } = await params;
        if (!itemId) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }
        const item = await prisma.item.findUnique({
            where: { id: itemId },
        });
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        await prisma.item.delete({
            where: { id: itemId },
        });
        return NextResponse.json(
            {
                message: "Item deleted successfully",
                itemId,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in deleting item by ID:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest, params: Promise<{ itemId: string }>) {
    try {
        const { itemId } = await params;
        if (!itemId) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }
        const existingItem = await prisma.item.findUnique({
            where: { id: itemId },
        });
        if (!existingItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        const body = await request.json();
        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: body,
        });
        return NextResponse.json(
            {
                message: "Item updated successfully",
                item: updatedItem,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in updating item by ID:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, params: Promise<{ itemId: string }>) {
    PATCH(request, params);
}
