import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/app/lib/prisma";
import { R2_PUBLIC_URL, s3Client, R2_BUCKET_NAME } from "@/app/lib/r2";

interface RouteParams {
  params: Promise<{ slideId: string }>;
}
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { slideId } = await params;

    const slide = await prisma.heroSlide.findUnique({ where: { id: slideId } });
    if (!slide) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    // Estrai la key di R2 dall'URL pubblico
    // Esempio URL: https://pub-xxx.r2.dev/hero_slides/nomefile.jpg
    // Vogliamo: hero_slides/nomefile.jpg
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
        // Non lanciamo errore qui, altrimenti rollbacka la delete del DB.
        // A volte è meglio avere file orfani su R2 piuttosto che DB inconsistente,
        // oppure gestire il rollback manualmente.
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
