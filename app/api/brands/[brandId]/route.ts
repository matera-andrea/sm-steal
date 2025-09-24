import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const brandNotFoundResponse = () => NextResponse.json(
    {
        error: "Brand not found",
    },
    { status: 404 }
);

const brandIdMissingResponse = () => NextResponse.json(
    {
        error: "Brand ID is required",
    },
    { status: 400 }
);

const brandErrorResponse = (error: any) => NextResponse.json(
    {
        error: error.message || "Internal Server Error",
    },
    { status: 500 }
);

const brandSuccessResponse = (brand: any, message: string) => NextResponse.json(
    {
        message,
        brand
    },
    { status: 200 }
);

export async function GET(request: NextRequest, params: Promise<{ brandId: string }> ) {
    try {
        const { brandId } = await params;
        if (!brandId) {
            return brandIdMissingResponse();
        }

        const brand = await prisma.brand.findUnique({
            where: { id: brandId },
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
            }
        });

        if (!brand) {
            return brandNotFoundResponse();
        }
        return brandSuccessResponse(brand, "Brand fetched successfully");

    } catch (error: any) {
        console.error("Error in fetching brand by ID:", error);
        return brandErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest,  params: Promise<{ brandId: string }> ) {
    try {
        const { brandId } = await params;
        if (!brandId) { return brandIdMissingResponse(); }

        await prisma.brand.delete({
            where: { id: brandId }
        });

        return brandSuccessResponse(null, "Brand deleted successfully");
    } catch (error: any) {
        console.error("Error in deleting brand by ID:", error);
        return brandErrorResponse(error);
    }
}

export async function PATCH(request: NextRequest, params: Promise<{ brandId: string }>) {
    try {
        const { brandId } = await params;
        if (!brandId) { return brandIdMissingResponse(); }
        const body = await request.json();
        const updatedBrand = await prisma.brand.update({
            where: { id: brandId },
            data: body
        });
        return brandSuccessResponse(updatedBrand, "Brand patched successfully");
    } catch (error: any) {
        console.error("Error in patching brand by ID:", error);
        return brandErrorResponse(error);
    }
}
export async function PUT(request: NextRequest, params: Promise<{ brandId: string }> ) {
    PATCH(request, params);
}