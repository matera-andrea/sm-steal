import z from "zod";

export const createPhotoSchema = z.object({
    name: z.string().min(1, "Il nome della foto è obbligatorio"),
    url: z.url("Deve essere un URL valido"),
    altText: z.string().optional(),
    listingId: z.string().min(1, "L'ID dell'inserzione è obbligatorio"),
});