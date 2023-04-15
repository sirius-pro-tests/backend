import { z } from 'nestjs-zod/z';

export type QuestionSchema = z.infer<typeof questionSchema>;
export const questionSchema = z.discriminatedUnion('kind', [
    z.object({
        id: z.number(),
        kind: z.literal('single-select'),
        variants: z.array(
            z.object({
                answer: z.string(),
                right: z.boolean(),
            })
        ),
    }),
]);
