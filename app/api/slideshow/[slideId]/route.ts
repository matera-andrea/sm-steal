import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/app/lib/prisma";
import { R2_PUBLIC_URL, s3Client, R2_BUCKET_NAME } from "@/app/lib/r2";
import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ slideId: string }>;
}

const slideUpdateSchema = z.object({
  title: z.string().max(200).default(""),
  subtitle: z.string().max(500).default(""),
  subtitleIsShopLink: z.boolean().default(false),
  titleIsAmber: z.boolean().default(false),
  target: z.enum(["all", "desktop", "mobile"]).default("all"),
});

// PUT: Aggiorna metadati di una slide esistente
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const { slideId } = await params;

    const existing = await prisma.heroSlide.findUnique({ where: { id: slideId } });
    if (!existing) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = slideUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const updated = await prisma.heroSlide.update({
      where: { id: slideId },
      data: validation.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SLIDESHOW_PUT_ERROR]", error);
    return NextResponse.json(
      { message: "Error updating slide" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const { slideId } = await params;

    const slide = await prisma.heroSlide.findUnique({ where: { id: slideId } });
    if (!slide) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    // Estrai la key di R2 dall'URL pubblico
    const fileKey = slide.url.replace(`${R2_PUBLIC_URL}/`, "");

    await prisma.$transaction(async (tx) => {
      // 1. Elimina da DB
      await tx.heroSlide.delete({ where: { id: slideId } });

      // 2. Elimina da R2
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
          }),
        );
      } catch (err) {
        console.error(
          "Errore cancellazione R2 (ignorato per non bloccare DB)",
          err,
        );
      }
    });

    return NextResponse.json({ message: "Slide deleted" });
  } catch (error) {
    console.error("Error deleting slide: ", error);
    return NextResponse.json(
      { message: "Error deleting slide" },
      { status: 500 },
    );
  }
}
