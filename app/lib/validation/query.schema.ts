import z from "zod";

export const querySchema = z.object({
  isActive: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().min(1).max(500).default(30),
  page: z.coerce.number().min(1).default(1),
  search: z.string().optional(),
});
