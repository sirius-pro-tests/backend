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
    SignInBodyDto,
    signInBodySchema,
    signInResponseSchema,
    SignInResponseSchema,
    SignUpBodyDto,
    signUpBodySchema,
} from './auth.dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @ApiOperation({ description: 'Получить токен' })
    @ApiBody({ schema: zodToOpenAPI(signInBodySchema) })
    @ApiUnauthorizedResponse({ description: 'Неверный логин и/или пароль' })
    @ApiOkResponse({ schema: zodToOpenAPI(signInResponseSchema) })
    async signIn(
        @Body() { login, password }: SignInBodyDto
    ): Promise<SignInResponseSchema> {
        const token = await this.authService.signIn(login, password);
        return { bearer: token };
    }

    @Post('signup')
    @ApiOperation({
        description: 'Создать пользователя',
    })
    @ApiBody({ schema: zodToOpenAPI(signUpBodySchema) })
    @ApiBadRequestResponse({
        description:
            'Не удалось создать пользователя (вероятно такой логин уже занят)',
    })
    @ApiOkResponse()
    async signUp(
        @Body() { login, password, fullName }: SignUpBodyDto
    ): Promise<void> {
        await this.authService.signUp({ login, password, fullName });
    }
}
