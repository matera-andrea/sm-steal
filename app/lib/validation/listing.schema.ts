import z from "zod";
export const createItemSchema = z.object({
    description: z.string().optional(),
    condition: z.enum(['NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCETTABLE', 'POOR'], {
        error: "La condizione è obbligatoria e deve essere una tra NEW, LIKE_NEW, VERY_GOOD, GOOD, ACCETTABLE, POOR",
    }),
    stock: z.number().positive("Lo stock non può essere negativo"),
    sizingIds: z.array(z.string()).min(1, "Deve essere selezionata almeno una taglia"),
    priceId: z.string().min(1, "L'ID del prezzo è obbligatorio"),
});