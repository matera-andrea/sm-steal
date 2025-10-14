// /lib/validation/item.schema.ts

import { z } from "zod";

// Enum presi direttamente dallo schema Prisma per coerenza
const CategoryItemEnum = z.enum([
  "SNEAKER",
  "SHOE",
  "COLLECTIBLE",
  "CLOTHING",
  "ACCESSORY",
  "OTHER",
]);
const GenderEnum = z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]);

export const createItemSchema = z.object({
  name: z
    .string({ message: "Il nome è obbligatorio." })
    .min(3, "Il nome deve contenere almeno 3 caratteri."),
  description: z.string().optional(),
  category: CategoryItemEnum,
  sku: z.string().optional(),
  gender: GenderEnum.default("UNISEX"),
  sneakerModelId: z.string({
    message: "L'ID del modello di sneaker è obbligatorio.",
  }),
});

export const updateItemSchema = createItemSchema.partial();

export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
