import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { sizingSchema } from "@/app/lib/validation/sizing.schema";
import z from "zod";

export async function GET(request: NextRequest) {
  try {
    const [sizes, total] = await Promise.all([
      prisma.sizing.findMany({ orderBy: { size: "asc" } }),
      prisma.sizing.count(),
    ]);
    return NextResponse.json(
      {
        data: sizes,
        pagination: {
          total,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Error fetching sizings: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = sizingSchema.parse(body);

    const existingSize = await prisma.sizing.findFirst({
      where: {
        size: validatedData.size,
        type: validatedData.SizingType,
      },
    });

    if (existingSize) {
      return NextResponse.json(
        { error: "Sizing already exists" },
        { status: 400 }
      );
    }

    const sizing = await prisma.sizing.create({
      data: {
        size: validatedData.size,
        type: validatedData.SizingType,
      },
    });

    return NextResponse.json(sizing, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating sizing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
