import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: 'asc' }
        });
        return new Response(JSON.stringify(brands));
    } catch (error: any) {
        console.error("Error in fetching brand list:", error);
        return NextResponse.json(
            { error: "Failed to fetch brand list" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, description, logoUrl } = await request.json();
        if (!name) {
            return NextResponse.json(
                { error: "Brand name is required" },
                { status: 400 }
            );
        }
        const newBrand = await prisma.brand.create({
            data: { name, description, logoUrl }
        });
        return NextResponse.json(
            {
                message: "Brand created successfully",
                brand: newBrand
            },
            { status: 201 }
        );
    }
    catch (error: any) {
        console.error("Error in creating brand:", error);
        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                brand: null
            },
            { status: 500 }
        );
    }
}