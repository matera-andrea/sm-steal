import prisma from "@/app/lib/prisma";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3Client } from "@/app/lib/r2";
import { validateImageFile } from "@/app/lib/validateUpload";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CategoryItem, Gender, ListingCondition } from "@prisma/client";
import { checkAdmin } from "@/app/lib/apiAdminCheck";

// --- SCHEMA DI VALIDAZIONE ---
export const bulkListingSchema = z.object({
  brandName: z.string().min(1),
  modelName: z.string().min(1),
  itemName: z.string().min(1),
  sku: z.string().min(1),

  category: z
    .enum(Object.values(CategoryItem) as [string, ...string[]])
    .optional()
    .default(CategoryItem.SNEAKER),
  gender: z
    .enum(Object.values(Gender) as [string, ...string[]])
    .optional()
    .default(Gender.MEN),

  description: z.string(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  variants: z.array(
    z.object({
      sizingId: z.string(),
      price: z.number().min(0),
      condition: z.enum(Object.values(ListingCondition) as [string, ...string[]]).default(ListingCondition.NEW),
      stock: z.number().int().min(1).default(1),
    }),
  ),
});

export async function POST(request: NextRequest) {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;
    const formData = await request.formData();
    const jsonData = formData.get("data");
    const files = formData.getAll("photos");

    if (!jsonData || typeof jsonData !== "string") {
      return NextResponse.json(
        { message: "Missing JSON data" },
        { status: 400 },
      );
    }

    const rawData = JSON.parse(jsonData);
    const validation = bulkListingSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dati non validi", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const {
      brandName,
      modelName,
      itemName,
      sku,
      category,
      gender,
      description,
      isActive,
      isFeatured,
      variants,
    } = validation.data;

    // --- FASE 1: TRANSAZIONE DATABASE (Solo dati testuali) ---
    // Rimuoviamo l'upload da qui per evitare timeout
    const listing = await prisma.$transaction(
      async (tx) => {
        // A. BRAND
        let brand = await tx.brand.findFirst({
          where: { name: { equals: brandName, mode: "insensitive" } },
        });

        if (!brand) {
          brand = await tx.brand.create({
            data: { name: brandName },
          });
        }

        // B. SNEAKER MODEL
        let model = await tx.sneakerModel.findFirst({
          where: {
            name: { equals: modelName, mode: "insensitive" },
            brandId: brand.id,
          },
        });

        if (!model) {
          model = await tx.sneakerModel.create({
            data: {
              name: modelName,
              brandId: brand.id,
            },
          });
          await tx.brand.update({
            where: { id: brand.id },
            data: { itemsCount: { increment: 1 } },
          });
        }

        // C. ITEM
        let item = await tx.item.findFirst({
          where: { sku: sku },
        });

        if (!item) {
          item = await tx.item.create({
            data: {
              name: itemName,
              sku: sku,
              sneakerModelId: model.id,
              category: category,
              gender: gender,
            },
          });
          await tx.sneakerModel.update({
            where: { id: model.id },
            data: { itemsCount: { increment: 1 } },
          });
        }

        // D. LISTING
        const existingListing = await tx.listing.findFirst({
          where: { itemId: item.id },
        });

        let listingRes;

        if (existingListing) {
          listingRes = await tx.listing.update({
            where: { id: existingListing.id },
            data: {
              description,
              isActive,
              isFeatured,
              updatedAt: new Date(),
            },
          });
        } else {
          listingRes = await tx.listing.create({
            data: {
              itemId: item.id,
              description,
              isActive,
              isFeatured,
            },
          });
          await tx.item.update({
            where: { id: item.id },
            data: { listingCount: { increment: 1 } },
          });
        }

        // E. VARIANTS
        for (const variant of variants) {
          await tx.listingSizing.upsert({
            where: {
              listingId_sizingId_condition: {
                listingId: listingRes.id,
                sizingId: variant.sizingId,
                condition: variant.condition,
              },
            },
            update: {
              price: variant.price,
              stock: variant.stock,
            },
            create: {
              listingId: listingRes.id,
              sizingId: variant.sizingId,
              condition: variant.condition,
              price: variant.price,
              stock: variant.stock,
            },
          });
        }

        return listingRes;
      },
      {
        // IMPORTANTE: Massimo 15000ms per Prisma Accelerate.
        // Avendo tolto l'upload, 10000ms dovrebbero avanzare.
        maxWait: 5000,
        timeout: 15000,
      },
    );

    // --- FASE 2: UPLOAD FOTO (Fuori dalla transazione) ---
    // Se l'upload fallisce qui, il listing esiste già ma senza foto (meno grave di un crash totale)
    if (files && files.length > 0) {
      try {
        // Recuperiamo il contatore attuale (fuori tx va bene)
        const existingPhotosCount = await prisma.photo.count({
          where: { listingId: listing.id },
        });

        let orderCounter = existingPhotosCount;
        const uploadPromises = [];

        for (const fileEntry of files) {
          if (fileEntry instanceof File) {
            // Prepariamo l'upload
            const buffer = Buffer.from(await fileEntry.arrayBuffer());
            const ext = fileEntry.name.split(".").pop() || "jpg";
            const uniqueFileName = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${ext}`;

            const key = `listings_photos/${listing.id}/${uniqueFileName}`;
            const publicUrl = `${R2_PUBLIC_URL}/${key}`;

            // Eseguiamo upload
            const uploadTask = s3Client
              .send(
                new PutObjectCommand({
                  Bucket: R2_BUCKET_NAME,
                  Key: key,
                  Body: buffer,
                  ContentType: fileEntry.type,
                }),
              )
              .then(async () => {
                // Dopo l'upload su R2 riuscito, salviamo su DB
                // Usiamo una piccola operazione DB atomica per ogni foto
                return prisma.photo.create({
                  data: {
                    url: publicUrl,
                    name: uniqueFileName,
                    altText: itemName,
                    isMain: orderCounter === 0, // Nota: logica semplificata per isMain
                    order: orderCounter++, // Incrementiamo per la prossima iterazione locale
                    listingId: listing.id,
                  },
                });
              });

            uploadPromises.push(uploadTask);
            // Incrementiamo counter locale per preservare ordine logico
            // (Nota: in promise parallele l'ordine esatto di fine non è garantito,
            // ma l'assegnazione 'order' qui è sequenziale nel loop)
            orderCounter++;
          }
        }

        // Aspettiamo che tutti gli upload finiscano.
        // Se usi Vercel Serverless Function, attenzione al timeout globale della funzione (default 10s o 60s).
        await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error("Errore durante upload immagini:", uploadError);
        // Non lanciamo errore bloccante, ritorniamo successo parziale
        // o logghiamo l'errore. Il listing è stato creato.
      }
    }

    return NextResponse.json(
      { message: "Listing creato/aggiornato con successo", listing },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[BULK_LISTING_POST] Error:", error);
    // Prisma error code handling opzionale
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
