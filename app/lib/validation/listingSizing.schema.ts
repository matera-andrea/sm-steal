import z from "zod";
export const createListingSizingSchema = z.object({
    listingId: z.string().min(1, "L'ID dell'inserzione è obbligatorio"),
    sizingId: z.string().min(1, "L'ID della taglia è obbligatorio"),
});