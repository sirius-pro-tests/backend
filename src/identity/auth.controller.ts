import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { AuthService } from './auth.service';
import {
    signInBodySchema,
    SignInBodySchema,
    signInResponseSchema,
    SignInResponseSchema,
    signUpBodySchema,
    SignUpBodySchema,
} from './auth.schemas';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @ApiOperation({ description: 'Получить токен' })
    @ApiBody({ schema: zodToOpenAPI(signInBodySchema) })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(signInResponseSchema) })
    async signIn(
        @Body() { login, password }: SignInBodySchema
    ): Promise<SignInResponseSchema> {
        const token = await this.authService.signIn(login, password);
        return { bearer: token };
    }

    @Post('signup')
    @ApiOperation({
        description: 'Создать пользователя',
    })
    @ApiBody({ schema: zodToOpenAPI(signUpBodySchema) })
    @ApiBadRequestResponse()
    @ApiOkResponse()
    async signUp(
        @Body() { login, password, fullName }: SignUpBodySchema
    ): Promise<void> {
        this.authService.signUp({ login, password, fullName });
    }
}
