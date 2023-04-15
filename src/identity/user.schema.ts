import { z } from 'nestjs-zod/z';

export const userSchema = z.object({
    id: z.number().int(),
    fullName: z.string(),
});
