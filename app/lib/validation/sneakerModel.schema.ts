// /lib/validation/sneakerModel.schema.ts

import { z } from "zod";

export const createSneakerModelSchema = z.object({
  name: z
    .string({ error: "Il nome del modello è obbligatorio." })
    .min(2, "Il nome deve contenere almeno 2 caratteri."),
  description: z.string().optional(),
  brandId: z.cuid("L'ID del brand non è valido."),
});

export const updateSneakerModelSchema = createSneakerModelSchema.partial();

export type CreateSneakerModelDto = z.infer<typeof createSneakerModelSchema>;
export type UpdateSneakerModelDto = z.infer<typeof updateSneakerModelSchema>;
