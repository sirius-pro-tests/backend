import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { questionFullSchema, questionOmittedSchema } from './question.schema';

export const getQuestionsResponseSchemaForAuthor = z.array(questionFullSchema);
export const getQuestionsResponseSchemaForUser = z.array(questionOmittedSchema);
export const getQuestionsResponseSchema = z.union([
    getQuestionsResponseSchemaForAuthor,
    getQuestionsResponseSchemaForUser,
]);
export type GetQuestionsResponseSchema = z.infer<
    typeof getQuestionsResponseSchema
>;

export const createQuestionBodySchema = questionFullSchema.pick({
    title: true,
    payload: true,
});
export class CreateQuestionBodyDto extends createZodDto(
    createQuestionBodySchema
) {}
export const createQuestionResponseSchema = questionFullSchema;
export type CreateQuestionResponseSchema = z.infer<typeof questionFullSchema>;

export const getQuestionsNotFoundErrorSchema = z.object({
    description: z.literal('TEST_NOT_FOUND'),
});

export const createQuestionNotFoundErrorSchema = z.object({
    description: z.literal('TEST_NOT_FOUND'),
});

export const createQuestionForbiddenErrorSchema = z.object({
    description: z.literal('YOU_ARE_NOT_AUTHOR'),
});
