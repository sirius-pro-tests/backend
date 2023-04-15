import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TestsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll() {
        return this.prisma.test.findMany();
    }
}
