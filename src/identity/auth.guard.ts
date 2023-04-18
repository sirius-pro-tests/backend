import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/identity/users.service';
import { tokenSchema } from 'src/identity/auth.dtos';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        try {
            const payload = await this.jwtService.verifyAsync(token);

            const { userId } = tokenSchema.parse(payload);

            const user = this.usersService.getById(userId);

            request.user = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Верификация токена не удалась', {
                description: 'BAD_BEARER',
                cause: error,
            });
        }
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if (type !== 'Bearer') {
            throw new UnauthorizedException('Неверный тип токена', {
                description: 'BAD_BEARER',
            });
        }

        return token;
    }
}
