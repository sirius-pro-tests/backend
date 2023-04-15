import { z } from 'nestjs-zod/z';
import { userSchema } from 'src/identity/user.schema';
import { questionSchema } from './question.schema';

export const testSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    author: userSchema,
    questions: z.array(questionSchema),
});
