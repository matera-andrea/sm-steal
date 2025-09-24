import z from "zod";

export const createBrandSchema = z.object({
    name: z.string().min(1, "Il nome del brand è obbligatorio"),
    description: z.string().optional(),
    logoUrl: z.url("Deve essere un URL valido").optional(),
});