import { z, ZodSchema } from 'zod';

// User schema for validation
export const productSchema = z.object({
  name: z.string().min(3),
  company: z.string().min(3),
  price: z.coerce.number().int().min(0),
  description: z.string(),
  featured: z.coerce.boolean(),
});
