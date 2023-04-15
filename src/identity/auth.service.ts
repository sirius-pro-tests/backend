import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { TokenSchema } from './auth.schemas';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    async signIn(login: string, password: string): Promise<string> {
        try {
            const user = await this.usersService.getByLogin(login);

            if (!(await this.comparePasswords(user.password, password))) {
                throw new Error('Неверный пароль');
            }

            const payload: TokenSchema = { userId: user.id };

            return await this.jwt.signAsync(payload, {
                algorithm: 'HS256',
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Неверный логин и/или пароль',
                HttpStatus.UNAUTHORIZED,
                { cause: error }
            );
        }
    }

    async signUp({
        login,
        password,
        fullName,
    }: {
        login: string;
        password: string;
        fullName: string;
    }): Promise<User> {
        const passwordHash = await this.hashPassword(password);

        return this.usersService.create({
            login,
            passwordHash,
            personals: { fullName },
        });
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');

        const buffer = await new Promise<Buffer>((resolve, reject) =>
            scrypt(password, salt, 64, (error, key) => {
                if (error) {
                    reject(error);
                }
                resolve(key);
            })
        );

        return `${buffer.toString('hex')}.${salt}`;
    }

    private async comparePasswords(
        storedPassword: string,
        receivedPassword: string
    ): Promise<boolean> {
        const [storedHash, salt] = storedPassword.split('.');

        const storedBuffer = Buffer.from(storedHash, 'hex');

        const receivedBuffer = await new Promise<Buffer>((resolve, reject) =>
            scrypt(receivedPassword, salt, 64, (error, key) => {
                if (error) {
                    reject(error);
                }

                resolve(key);
            })
        );

        return timingSafeEqual(storedBuffer, receivedBuffer);
    }
}
