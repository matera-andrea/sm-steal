// /lib/validation/listing.schema.ts

import { z } from "zod";

// Enum presi direttamente dallo schema Prisma per coerenza.
const ListingConditionEnum = z.enum([
  "NEW",
  "LIKE_NEW",
  "VERY_GOOD",
  "GOOD",
  "ACCEPTABLE",
  "POOR",
]);

export const createListingSchema = z.object({
  description: z.string().optional(),
  condition: ListingConditionEnum.default("NEW"),
  stock: z.coerce.number().min(1, "Lo stock deve essere almeno 1.").default(1),
  price: z.coerce
    .number({ error: "Il prezzo deve essere un numero." })
    .positive("Il prezzo deve essere un valore positivo."),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  endDate: z.date().optional(),
  itemId: z.cuid("L'ID dell'articolo non è valido."),

  sizingIds: z
    .array(z.cuid("Uno o più ID di taglia non sono validi."))
    .min(1, "È richiesta almeno una taglia."),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingDto = z.infer<typeof createListingSchema>;
export type UpdateListingDto = z.infer<typeof updateListingSchema>;
