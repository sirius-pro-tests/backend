import { z } from 'nestjs-zod/z';
import { questionSchema } from 'src/tests/question.schema';

export const getQuestionsOfTestResponseSchema = z.array(questionSchema);
export type GetQuestionsOfTestResponseSchema = z.infer<
    typeof getQuestionsOfTestResponseSchema
>;
