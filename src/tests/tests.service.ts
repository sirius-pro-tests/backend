import { Injectable, NotFoundException } from '@nestjs/common';
import { Test, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TestsService {
    constructor(private readonly prisma: PrismaService) {}

    async getOwned(user: User) {
        return this.prisma.test.findMany({
            where: { authorId: user.id },
            include: { author: true },
        });
    }

    async getInvited(user: User) {
        const userInvitedTests = await this.prisma.userInvitedTests.findMany({
            where: { userId: user.id },
            include: { test: { include: { author: true } } },
        });

        return userInvitedTests.map((userInvitedTest) => userInvitedTest.test);
    }

    async create(author: User, title: string, description: string) {
        return this.prisma.test.create({
            data: { authorId: author.id, description, title },
            include: { author: true },
        });
    }

    async getById(testId: Test['id']) {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
        });

        if (!test) {
            throw new NotFoundException('Тест не найден', {
                description: 'TEST_NOT_FOUND',
            });
        }

        return test;
    }

    async isAuthor(
        authorId: Test['authorId'],
        testId: Test['id']
    ): Promise<boolean> {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
        });

        return test?.authorId === authorId;
    }
}
