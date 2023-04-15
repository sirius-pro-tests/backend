import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/identity/users.service';
import {
    signInBodySchema,
    SignInBodySchema,
    signInResponseSchema,
    SignInResponseSchema,
    signUpBodySchema,
    SignUpBodySchema,
} from 'src/identity/auth.schemas';
import { AuthService } from 'src/identity/auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post('signin')
    @ApiBody({ schema: zodToOpenAPI(signInBodySchema) })
    @ApiOkResponse({ schema: zodToOpenAPI(signInResponseSchema) })
    async signIn(
        @Body() { login, password }: SignInBodySchema
    ): Promise<SignInResponseSchema> {
        const token = await this.authService.signIn(login, password);
        return { bearer: token };
    }

    @Post('signup')
    @ApiBody({ schema: zodToOpenAPI(signUpBodySchema) })
    async signUp(
        @Body() { login, password, fullName }: SignUpBodySchema
    ): Promise<void> {
        this.usersService.create({ login, password, personals: { fullName } });
    }
}
