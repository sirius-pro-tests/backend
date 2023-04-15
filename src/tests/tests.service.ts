import { Injectable } from '@nestjs/common';
import { Test, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TestsService {
    constructor(private readonly prisma: PrismaService) {}

    async getOwned(user: User): Promise<Array<Test>> {
        return this.prisma.test.findMany({ where: { authorId: user.id } });
    }

    async getInvited(user: User): Promise<Array<Test>> {
        const userInvitedTests = await this.prisma.userInvitedTests.findMany({
            where: { userId: user.id },
            include: { test: true },
        });

        return userInvitedTests.map((userInvitedTest) => userInvitedTest.test);
    }
}
