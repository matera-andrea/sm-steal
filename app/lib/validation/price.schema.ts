import z from 'zod'
export const createPriceSchema = z.object({
  basePrice: z.number().positive('Il prezzo base deve essere positivo'),
  salePrice: z.number().positive('Il prezzo di vendita deve essere positivo').optional(),
  validFrom: z.iso.datetime().optional(),
  validUntil: z.iso.datetime().optional(),
  listingId: z.string().min(1, 'L\'ID dell\'annuncio è obbligatorio')
})