import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const prices = await prisma.price.findMany();
        return new Response(JSON.stringify(prices));
    } catch (error: any) {
        console.error("Error in fetching price list:", error);
        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                prices: []
            },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const { amount, currency } = await request.json();