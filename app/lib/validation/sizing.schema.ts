import z, { size } from 'zod'
export const createSizingSchema = z.object({
    size: z.string().min(1, 'La taglia è obbligatoria').max(10, 'La taglia non può superare i 10 caratteri'),
    SizingType: z.enum(['UK', 'US', 'IT'], {
        error: 'Il tipo di taglia è obbligatorio [UK, US, IT]',
    }),
    brandId: z.string().min(1, 'L\'ID del brand è obbligatorio')
})