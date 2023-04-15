import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/identity/auth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },
            }),
        }),
    ],
    providers: [JwtService, UsersService, AuthService, AuthGuard],
    controllers: [AuthController],
    exports: [UsersService, AuthGuard],
})
export class IdentityModule {}
