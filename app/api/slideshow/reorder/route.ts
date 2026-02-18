import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().cuid(),
        order: z.number().int().min(0).max(1000),
      }),
    )
    .max(100),
});

export async function PUT(req: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const body = await req.json();
    const validation = reorderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const { items } = validation.data;

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
