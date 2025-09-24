import z from "zod";
export const createItemSchema = z.object({
    name: z.string().min(1, "Il nome dell'articolo è obbligatorio"),
    description: z.string().optional(),
    brandId: z.string().min(1, "L'ID del brand è obbligatorio"),
    category: z.enum(['SNEAKERS', 'SHOE', 'COLLECTIBLE', 'CLOTHING', 'ACCESSORY', 'OTHER'], {
        error: "La categoria è obbligatoria e deve essere una tra SNEAKERS, SHOE, COLLECTIBLE, CLOTHING, ACCESSORY, OTHER",
    }),
    sku: z.string().optional(),
    gender: z.enum(['MAN', 'WOMAN', 'UNISEX', 'KID'], {
        error: "Il genere è obbligatorio e deve essere una tra MAN, WOMAN, UNISEX, KID",
    })
});