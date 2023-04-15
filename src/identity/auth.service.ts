import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { TokenSchema } from 'src/identity/auth.schemas';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {}

    async signIn(login: string, password: string): Promise<string> {
        const user = await this.prisma.user.findFirst({
            where: { username: login },
        });

        if (!user) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!(await this.comparePasswords(user.password, password))) {
            throw new HttpException(
                'Неверный логин и/или пароль',
                HttpStatus.UNAUTHORIZED
            );
        }

        const payload: TokenSchema = { userId: user.id };

        return this.jwt.sign(payload);
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
