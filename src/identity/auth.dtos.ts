import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export type TokenSchema = z.infer<typeof tokenSchema>;
export const tokenSchema = z.object({
    userId: z.number(),
});

export type SignInBodySchema = z.infer<typeof signInBodySchema>;
export const signInBodySchema = z.object({
    login: z.string(),
    password: z.string(),
});
export class SignInBodyDto extends createZodDto(signInBodySchema) {}

export type SignInResponseSchema = z.infer<typeof signInResponseSchema>;
export const signInResponseSchema = z.object({
    bearer: z.string(),
});

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>;
export const signUpBodySchema = z.object({
    login: z.string(),
    password: z.string(),
    fullName: z.string(),
});
export class SignUpBodyDto extends createZodDto(signUpBodySchema) {}

export const signUpBadRequestErrorScheme = z.object({
    error: z.literal('LOGIN_IS_BUSY'),
});

export const signInUnauthorizedErrorScheme = z.object({
    error: z.literal('BAD_CREDS'),
});
