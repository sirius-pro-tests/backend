import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { testSchema } from 'src/tests/test.schema';

export const createTestBodySchema = testSchema.pick({
    title: true,
    description: true,
});
export class CreateTestBodyDto extends createZodDto(createTestBodySchema) {}

export const createTestResponseSchema = testSchema.omit({ questions: true });
export type CreateTestResponseSchema = z.infer<typeof createTestResponseSchema>;

export const getOwnedTestsSchema = testSchema.omit({ questions: true });
export type GetOwnedTestsSchema = z.infer<typeof getOwnedTestsSchema>;

export const getInvitedTestsSchema = testSchema.omit({ questions: true });
export type GetInvitedTestsSchema = z.infer<typeof getInvitedTestsSchema>;
