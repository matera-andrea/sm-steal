import z from "zod";
export const itemSchema = z.object({
  name: z.string().min(1, "Il nome dell'articolo è obbligatorio"),
  description: z.string().optional(),
  brandId: z.string().min(1, "L'ID del brand è obbligatorio"),

  category: z.enum(
    ["SNEAKER", "SHOE", "COLLECTIBLE", "CLOTHING", "ACCESSORY", "OTHER"],
    {
      error:
        "La categoria è obbligatoria e deve essere una tra SNEAKER, SHOE, COLLECTIBLE, CLOTHING, ACCESSORY, OTHER",
    }
  ),
  sku: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"], {
    error:
      "Il genere è obbligatorio e deve essere una tra MEN, WOMEN, UNISEX, KIDS",
  }),
});

export type Item = z.infer<typeof itemSchema>;
