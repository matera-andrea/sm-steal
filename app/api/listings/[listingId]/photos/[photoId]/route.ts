// app/api/listings/[listingId]/photos/[photoId]/route.ts

import prisma from "@/app/lib/prisma";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3Client } from "@/app/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema per la validazione dei parametri della rotta
const paramsSchema = z.object({
  listingId: z.string().cuid({ message: "ID del listing non valido." }),
  photoId: z.string().cuid({ message: "ID della foto non valido." }),
});

// Schema per l'aggiornamento (PATCH) - SOLO Metadati
// L'URL non è aggiornabile, va cancellata e ricaricata
const updatePhotoSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio.").optional(),
  altText: z.string().optional().nullable(),
  isMain: z.boolean().optional(),
  order: z.number().int().optional(),
});

// Helper
const findPhotoByListing = (listingId: string, photoId: string) => {
  return prisma.photo.findUnique({
    where: {
      id: photoId,
      listingId: listingId,
    },
  });
};

//
// GET A SINGLE PHOTO (Invariato)
//
export async function GET(
  request: NextRequest,
  { params }: { params: { listingId: string; photoId: string } }
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
    const { listingId, photoId } = paramsValidation.data;

    const photo = await findPhotoByListing(listingId, photoId);

    if (!photo) {
      return NextResponse.json(
        {
          message: `Foto con ID '${photoId}' non trovata o non appartenente al listing '${listingId}'.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("[LISTING_PHOTO_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// UPDATE A SINGLE PHOTO (Solo Metadati, R2 non coinvolto)
//
export async function PATCH(
  request: NextRequest,
  { params }: { params: { listingId: string; photoId: string } }
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
    const { listingId, photoId } = paramsValidation.data;

    const body = await request.json();
    const bodyValidation = updatePhotoSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: bodyValidation.error.issues },
        { status: 400 }
      );
    }

    if (Object.keys(bodyValidation.data).length === 0) {
      return NextResponse.json(
        { message: "Nessun dato fornito per l'aggiornamento." },
        { status: 400 }
      );
    }

    const { isMain, ...photoData } = bodyValidation.data;

    const updatedPhoto = await prisma.$transaction(async (tx) => {
      if (isMain === true) {
        await tx.photo.updateMany({
          where: {
            listingId: listingId,
            NOT: { id: photoId },
          },
          data: { isMain: false },
        });
      }

      return await tx.photo.update({
        where: { id: photoId, listingId: listingId },
        data: {
          ...photoData,
          ...(isMain !== undefined && { isMain: isMain }),
        },
      });
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          message: `Foto con ID '${params.photoId}' non trovata o non appartenente al listing '${params.listingId}'.`,
        },
        { status: 404 }
      );
    }
    console.error("[LISTING_PHOTO_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//
// DELETE A SINGLE PHOTO (Elimina da DB e R2)
//
export async function DELETE(
  request: NextRequest,
  { params }: { params: { listingId: string; photoId: string } }
) {
  try {
    // 1. Valida i parametri
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
    const { listingId, photoId } = paramsValidation.data;

    // 2. Trova la foto prima di eliminarla (per ottenere l'URL)
    const photo = await findPhotoByListing(listingId, photoId);
    if (!photo) {
      return NextResponse.json(
        {
          message: `Foto con ID '${photoId}' non trovata o non appartenente al listing '${listingId}'.`,
        },
        { status: 404 }
      );
    }

    // 3. Elimina dal Database
    await prisma.photo.delete({
      where: {
        id: photoId,
        listingId: listingId,
      },
    });

    // 4. Tenta di eliminare da R2
    // Controlliamo che l'URL sia un URL R2 gestito da noi
    if (photo.url && photo.url.startsWith(R2_PUBLIC_URL!)) {
      try {
        // Estrai la "Key" dall'URL pubblico
        // e.g. https://pub.dev/listings_photos/123/abc.jpg -> listings_photos/123/abc.jpg
        const key = photo.url.substring(R2_PUBLIC_URL!.length + 1);

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
          })
        );
      } catch (r2Error) {
        // Non bloccare la risposta se l'eliminazione del file fallisce
        // (il record DB è già sparito), ma logga l'errore.
        console.error(
          `[R2_DELETE_ERROR] Impossibile eliminare il file ${photo.url} da R2:`,
          r2Error
        );
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Questo caso è già gestito dal check iniziale, ma lo teniamo per sicurezza
      return NextResponse.json(
        {
          message: `Foto con ID '${params.photoId}' non trovata.`,
        },
        { status: 404 }
      );
    }
    console.error("[LISTING_PHOTO_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
