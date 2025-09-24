import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const items = await prisma.item.findMany();
        return new Response(JSON.stringify(items));
    } catch (error: any) {
        console.error("Error in fetching item list:", error);
        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                items: []
            },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const { name, description,category,condition, price } = await request.json();
        if (!name || !price) {
            return NextResponse.json(
                {
                    error: "Item name and price are required",
                    item: null
                },
                { status: 400 }
            );
        }
        const newItem = await prisma.item.create({
            data: { name, description, price }
        });
        return NextResponse.json(
            {
                message: "Item created successfully",
                item: newItem
            },
            { status: 201 }
        );
    }
    catch (error: any) {
        console.error("Error in creating item:", error);
        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                item: null
            },
            { status: 500 }
        );
    }
}