import { z } from 'nestjs-zod/z';

const questionPayloadVariantWithAnswer = z.object({
    answer: z.string(),
    right: z.boolean(),
});

const questionPayloadVariantWithoutAnswer =
    questionPayloadVariantWithAnswer.omit({ right: true });

export const questionPayloadFullSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('single-select'),
        variants: z.array(questionPayloadVariantWithAnswer),
    }),
]);
export type QuestionPayloadSchema = z.infer<typeof questionPayloadFullSchema>;

export const questionPayloadOmittedSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('single-select'),
        variants: z.array(questionPayloadVariantWithoutAnswer),
    }),
]);
export type QuestionPayloadOmittedSchema = z.infer<
    typeof questionPayloadOmittedSchema
>;

export const questionFullSchema = z.object({
    id: z.number(),
    title: z.string(),
    payload: questionPayloadFullSchema,
});
export type QuestionFullSchema = z.infer<typeof questionFullSchema>;

export const questionOmittedSchema = z.object({
    id: z.number(),
    title: z.string(),
    payload: questionPayloadOmittedSchema,
});
export type QuestionOmittedSchema = z.infer<typeof questionOmittedSchema>;
