import { z } from 'nestjs-zod/z';

export const attemptAnswerSchema = z.object({
    question: z.string(),
    answer: z.string(),
    right: z.boolean(),
});
export type AttemptAnswerSchema = z.infer<typeof attemptAnswerSchema>;

export const attemptAnswerWithoutRightSchema = attemptAnswerSchema.omit({
    right: true,
});
