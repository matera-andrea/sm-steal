import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/app/lib/prisma";
import { R2_PUBLIC_URL, s3Client, R2_BUCKET_NAME } from "@/app/lib/r2";
import { validateImageFile } from "@/app/lib/validateUpload";
import { z } from "zod";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

const slideshowSchema = z.object({
  title: z.string().max(200).default(""),
  subtitle: z.string().max(500).default(""),
});

// GET: Recupera le slide dal DB
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" }, // O createdAt: 'desc' se preferisci le più recenti
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("[SLIDESHOW_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Error fetching slides" },
      { status: 500 },
    );
  }
}

// POST: Carica nuova slide
export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "File mancante o invalido" },
        { status: 400 },
      );
    }

    const fileError = validateImageFile(file);
    if (fileError) {
      return NextResponse.json({ message: fileError }, { status: 400 });
    }

    const validation = slideshowSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
    });
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.issues },
        { status: 400 },
      );
    }
    const { title, subtitle } = validation.data;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `slide-${Date.now()}.${fileExtension}`;

    // Path nel bucket: hero_slides/filename.jpg
    const key = `hero_slides/${uniqueFileName}`;
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    // Transazione: Crea DB Record + Upload R2
    const newSlide = await prisma.$transaction(async (tx) => {
      // 1. Crea record
      const slide = await tx.heroSlide.create({
        data: {
          url: publicUrl,
          title: title || "",
          subtitle: subtitle || "",
          order: 0, // Implementare logica di ordine se necessario
        },
      });

      // 2. Upload su R2
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          }),
        );
      } catch (uploadError) {
        console.error("[R2_UPLOAD_ERROR]", uploadError);
        throw new Error("Impossibile caricare il file su R2.");
      }

      return slide;
    });

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error: unknown) {
    console.error("[SLIDESHOW_POST_ERROR]", error);
    return NextResponse.json(
      { message: error || "Internal Error" },
      { status: 500 },
    );
  }
}
