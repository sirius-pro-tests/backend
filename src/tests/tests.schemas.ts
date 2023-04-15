import { z } from 'nestjs-zod/z';

export type QuestionSchema = z.infer<typeof questionSchema>;
const questionSchema = z.discriminatedUnion('kind', [
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

export type TestSchema = z.infer<typeof testSchema>;
const testSchema = z.object({
    id: z.number(),
    title: z.string(),
    questions: z.array(questionSchema),
});

export type TestsSchemaWithoutQuestions = z.infer<
    typeof testsSchemaWithoutQuestions
>;
const testsSchemaWithoutQuestions = z.array(
    testSchema.omit({ questions: true })
);
