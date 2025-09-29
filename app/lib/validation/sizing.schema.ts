import z from "zod";
export const sizingSchema = z.object({
  size: z
    .string()
    .min(1, "La taglia è obbligatoria")
    .max(10, "La taglia non può superare i 10 caratteri"),
  SizingType: z.enum(["UK", "US", "IT"], {
    error: "Il tipo di taglia è obbligatorio [UK, US, IT]",
  }),
  brandId: z.string().min(1, "L'ID del brand è obbligatorio"),
});

export type Sizing = z.infer<typeof sizingSchema>;
