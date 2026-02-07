import prisma from "@/app/lib/prisma";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3Client } from "@/app/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// IMPORTANTE: Importa gli Enum generati da Prisma
import { CategoryItem, Gender, ListingCondition } from "@prisma/client";

// --- SCHEMA DI VALIDAZIONE ---
export const bulkListingSchema = z.object({
  brandName: z.string().min(1),
  modelName: z.string().min(1),
  itemName: z.string().min(1),
  sku: z.string().min(1),

  category: z.enum(CategoryItem).optional().default(CategoryItem.SNEAKER),
  gender: z.enum(Gender).optional().default(Gender.MEN),

  description: z.string(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  variants: z.array(
    z.object({
      sizingId: z.string(),
      price: z.number().min(0),
      // Validiamo anche la condizione per sicurezza
      condition: z.enum(ListingCondition).default(ListingCondition.NEW),
      stock: z.number().int().min(1).default(1),
    }),
  ),
});

export async function POST(request: NextRequest) {
  try {
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

    const result = await prisma.$transaction(
      async (tx) => {
        let brand = await tx.brand.findFirst({
          where: { name: { equals: brandName, mode: "insensitive" } },
        });

        if (!brand) {
          brand = await tx.brand.create({
            data: { name: brandName },
          });
        }

        // --- STEP B: SNEAKER MODEL ---
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

        // --- STEP D: LISTING ---
        const existingListing = await tx.listing.findFirst({
          where: { itemId: item.id },
        });

        let listing;

        if (existingListing) {
          listing = await tx.listing.update({
            where: { id: existingListing.id },
            data: {
              description,
              isActive,
              isFeatured,
              updatedAt: new Date(),
            },
          });
        } else {
          listing = await tx.listing.create({
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

        // --- STEP E: VARIANTS ---
        for (const variant of variants) {
          await tx.listingSizing.upsert({
            where: {
              listingId_sizingId_condition: {
                listingId: listing.id,
                sizingId: variant.sizingId,
                condition: variant.condition,
              },
            },
            update: {
              price: variant.price,
              stock: variant.stock,
            },
            create: {
              listingId: listing.id,
              sizingId: variant.sizingId,
              condition: variant.condition,
              price: variant.price,
              stock: variant.stock,
            },
          });
        }

        // --- STEP F: PHOTOS ---
        if (files && files.length > 0) {
          const existingPhotosCount = await tx.photo.count({
            where: { listingId: listing.id },
          });

          let orderCounter = existingPhotosCount;

          for (const fileEntry of files) {
            if (fileEntry instanceof File) {
              const buffer = Buffer.from(await fileEntry.arrayBuffer());
              const ext = fileEntry.name.split(".").pop() || "jpg";
              const uniqueFileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(7)}.${ext}`;

              const key = `listings_photos/${listing.id}/${uniqueFileName}`;
              const publicUrl = `${R2_PUBLIC_URL}/${key}`;

              try {
                await s3Client.send(
                  new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: fileEntry.type,
                  }),
                );
              } catch (uploadError) {
                console.error("R2 Upload Error:", uploadError);
                throw new Error("Failed to upload image to R2");
              }

              await tx.photo.create({
                data: {
                  url: publicUrl,
                  name: uniqueFileName,
                  altText: itemName,
                  isMain: orderCounter === 0,
                  order: orderCounter,
                  listingId: listing.id,
                },
              });

              orderCounter++;
            }
          }
        }

        return listing;
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    return NextResponse.json(
      { message: "Listing creato/aggiornato con successo", listing: result },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[BULK_LISTING_POST] Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
