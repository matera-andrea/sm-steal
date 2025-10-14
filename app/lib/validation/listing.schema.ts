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

// Schema per la CREAZIONE di un Listing
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
  itemId: z
    .string({ error: "L'ID dell'articolo è obbligatorio." })
    .cuid("L'ID dell'articolo non è valido."),

  // AGGIUNTA: Array degli ID delle taglie (Sizing) da associare.
  // Questo è il modo corretto per gestire una relazione many-to-many.
  sizingIds: z
    .array(z.string().cuid("Uno o più ID di taglia non sono validi."))
    .min(1, "È richiesta almeno una taglia."),
});

// Schema per l'AGGIORNAMENTO, con tutti i campi opzionali.
// `sizingIds` è opzionale qui per permettere di aggiornare solo altri campi
// senza dover specificare di nuovo le taglie.
export const updateListingSchema = createListingSchema.partial();

// Tipi inferiti per l'utilizzo nel codice
export type CreateListingDto = z.infer<typeof createListingSchema>;
export type UpdateListingDto = z.infer<typeof updateListingSchema>;
