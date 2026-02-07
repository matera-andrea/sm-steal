import z from "zod";

export const bulkListingSchema = z.object({
  brandName: z.string().min(1),
  modelName: z.string().min(1),
  itemName: z.string().min(1),
  sku: z.string().min(1),

  category: z
    .enum(["SNEAKER", "SHOE", "COLLECTIBLE", "CLOTHING", "ACCESSORY", "OTHER"])
    .default("SNEAKER"),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]).default("MEN"),

  description: z.string(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  variants: z.array(
    z.object({
      sizingId: z.string(),
      price: z.number().min(0),
      condition: z
        .enum(["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE", "POOR"])
        .default("NEW"),
      stock: z.number().int().min(1).default(1),
    })
  ),
});
