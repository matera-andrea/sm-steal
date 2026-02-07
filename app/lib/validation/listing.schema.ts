// /lib/validation/listing.schema.ts

import { z } from "zod";

const ListingConditionEnum = z.enum([
  "NEW",
  "LIKE_NEW",
  "VERY_GOOD",
  "GOOD",
  "ACCEPTABLE",
  "POOR",
]);

const ListingVariantSchema = z.object({
  sizingId: z.cuid("ID taglia non valido."),
  price: z.coerce
    .number({ error: "Il prezzo deve essere un numero." })
    .positive("Il prezzo deve essere positivo."),
  condition: ListingConditionEnum.default("NEW"),
  stock: z.coerce.number().min(0).default(1),
});

export const createListingSchema = z.object({
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  endDate: z.coerce.date().optional(),
  itemId: z.cuid("ID articolo non valido."),

  variants: z.array(ListingVariantSchema).min(0),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingDto = z.infer<typeof createListingSchema>;
export type UpdateListingDto = z.infer<typeof updateListingSchema>;
export type ListingVariantDto = z.infer<typeof ListingVariantSchema>;
