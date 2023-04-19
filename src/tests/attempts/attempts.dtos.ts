import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getResultResponseSchema = z.array(
    z.object({
        question: z.string(),
        answer: z.string(),
        right: z.boolean(),
    })
);
export type GetResultResponseSchema = z.infer<typeof getResultResponseSchema>;

export const submitResultBodySchema = z.array(
    z.object({
        title: z.string(),
        answer: z.string(),
    })
);
export type SubmitResultBodySchema = z.infer<typeof submitResultBodySchema>;
export class SubmitResultBodyDto extends createZodDto(submitResultBodySchema) {}
