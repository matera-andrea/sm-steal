import z from "zod";

export const photoSchema = z.object({
  name: z.string().min(1, "Il nome della foto è obbligatorio"),
  url: z.url("Deve essere un URL valido"),
  altText: z.string().optional(),
  isMain: z.enum(["true", "false"]).default("false"),
  order: z
    .number()
    .min(0, "Il numero di foto non puo' essere negativo")
    .optional(),
  listingId: z.string().min(1, "L'ID dell'inserzione è obbligatorio"),
});

export type Photo = z.infer<typeof photoSchema>;
