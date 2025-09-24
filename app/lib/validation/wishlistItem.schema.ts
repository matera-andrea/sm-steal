import z from "zod";
export const createWishlistItemSchema = z.object({
    userId: z.string().min(1, "L'ID dell'utente è obbligatorio"),
    itemId: z.string().optional(),
    listingId: z.string().optional(),
});