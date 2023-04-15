import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create({
        login,
        passwordHash,
        personals,
    }: {
        login: string;
        passwordHash: string;
        personals: { fullName: string };
    }): Promise<User> {
        const potential = await this.prisma.user.findFirst({
            where: { username: login },
        });

        if (potential) {
            throw new HttpException(
                'Пользователь с таким логином уже существует',
                HttpStatus.BAD_REQUEST
            );
        }

        return this.prisma.user.create({
            data: {
                username: login,
                password: passwordHash,
                fullName: personals.fullName,
            },
        });
    }

    async getById(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.UNAUTHORIZED
            );
        }

        return user;
    }

    async getByLogin(login: string): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: { username: login },
        });

        if (!user) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.NOT_FOUND
            );
        }

        return user;
    }
}
