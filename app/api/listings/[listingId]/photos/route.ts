// app/api/listings/[listingId]/photos/route.ts

import prisma from "@/app/lib/prisma";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3Client } from "@/app/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema per la validazione dei parametri della rotta
const paramsSchema = z.object({
  listingId: z.cuid({ message: "ID del listing non valido." }),
});

// Schema per i dati del form (che arrivano come stringhe)
const createPhotoSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio."),
  altText: z.string().optional(),
  // Trasforma la stringa 'true'/'false' da FormData in booleano
  isMain: z
    .string()
    .transform((val) => val === "true")
    .default(false),
  // Converte la stringa 'order' in numero
  order: z.coerce.number().int().default(0),
});

//
// GET ALL PHOTOS FOR A LISTING (Invariato)
//
export async function GET(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const paramsValidation = paramsSchema.safeParse(params);
    if (!paramsValidation.success) {
      return NextResponse.json(
        {
          message: "Parametri non validi",
          errors: paramsValidation.error.issues,
        },
        { status: 400 }
      );
    }
    const { listingId } = paramsValidation.data;

    const listingExists = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listingExists) {
      return NextResponse.json(
        { message: `Listing con ID '${listingId}' non trovato.` },
        { status: 404 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: { listingId: listingId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("[LISTING_PHOTOS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// CREATE A NEW PHOTO FOR A LISTING (Gestisce l'upload)
//
export async function POST(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    // 1. Valida i parametri della rotta
    const paramsValidation = paramsSchema.safeParse(await params);
    if (!paramsValidation.success) {
      return NextResponse.json(
        {
          message: "Parametri non validi",
          errors: paramsValidation.error.issues,
        },
        { status: 400 }
      );
    }
    const { listingId } = paramsValidation.data;

    // 2. Controlla che il listing associato esista
    const listingExists = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listingExists) {
      return NextResponse.json(
        { message: `Il listing con ID '${listingId}' non esiste.` },
        { status: 404 }
      );
    }

    // 3. Estrai FormData e valida il file
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "File non valido o mancante." },
        { status: 400 }
      );
    }

    // 4. Valida i metadati dal form
    const formValues = {
      name: formData.get("name"),
      altText: formData.get("altText"),
      isMain: formData.get("isMain"),
      order: formData.get("order"),
    };

    console.log(formValues);
    const bodyValidation = createPhotoSchema.safeParse(formValues);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: bodyValidation.error.issues },
        { status: 400 }
      );
    }

    const { isMain, ...photoData } = bodyValidation.data;

    // 5. Prepara il file per R2
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${Date.now()}.${fileExtension}`;

    // Path nel bucket: sm-steal/listings_photos/[listingId]/[photoId].ext
    const key = `listings_photos/${listingId}/${uniqueFileName}`;
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    // 6. Esegui Upload su R2 e Creazione DB in transazione
    const newPhoto = await prisma.$transaction(async (tx) => {
      // Step A: Se la nuova foto è 'main', resetta le altre
      if (isMain === true) {
        await tx.photo.updateMany({
          where: { listingId: listingId },
          data: { isMain: false },
        });
      }

      // Step B: Crea il record nel database
      const createdPhoto = await tx.photo.create({
        data: {
          ...photoData,
          url: publicUrl, // Salva l'URL pubblico di R2
          isMain: isMain,
          listingId: listingId,
        },
      });

      // Step C: Carica il file su R2 (solo dopo che il DB è pronto)
      // Se questo fallisce, la transazione farà rollback
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          })
        );
      } catch (uploadError) {
        console.error("[R2_UPLOAD_ERROR]", uploadError);
        // Forza il rollback della transazione
        throw new Error("Impossibile caricare il file su R2.");
      }

      return createdPhoto;
    });

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error("[LISTING_PHOTOS_POST] Error:", error);
    // Gestisce l'errore dalla transazione
    if (error instanceof Error && error.message.includes("R2")) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
