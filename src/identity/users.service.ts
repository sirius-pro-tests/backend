import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create({
        login,
        password,
        personals,
    }: {
        login: string;
        password: string;
        personals: { fullName: string };
    }): Promise<User> {
        return this.prisma.user.create({
            data: { username: login, password, fullName: personals.fullName },
        });
    }

    async getById(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
