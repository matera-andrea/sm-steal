import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body as { items: { id: string; order: number }[] };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Eseguiamo tutti gli aggiornamenti in una singola transazione database
    await prisma.$transaction(
      items.map((item) =>
        prisma.heroSlide.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REORDER_ERROR]", error);
    return NextResponse.json({ message: "Reorder failed" }, { status: 500 });
  }
}
