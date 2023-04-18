import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { QuestionPayloadOmittedSchema } from 'src/tests/question.schema';
import { TestsService } from 'src/tests/tests.service';

@Injectable()
export class QuestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly testsService: TestsService
    ) {}

    async getQuestions(testId: number) {
        if (!(await this.testsService.isExists(testId))) {
            throw new NotFoundException('Тест не найден', {
                description: 'TEST_NOT_FOUND',
            });
        }

        const questions = await this.prisma.question.findMany({
            where: { testId },
        });

        return questions;
    }

    async createQuestion(
        testId: number,
        userId: User['id'],
        payload: QuestionPayloadOmittedSchema,
        title: string
    ) {
        if (!(await this.testsService.isExists(testId))) {
            throw new NotFoundException('Тест не найден', {
                description: 'TEST_NOT_FOUND',
            });
        }

        if (!(await this.testsService.isAuthor(userId, testId))) {
            throw new ForbiddenException('Вы не являетесь автором теста', {
                description: 'YOU_ARE_NOT_AUTHOR',
            });
        }

        return this.prisma.question.create({
            data: { testId, payload, title },
        });
    }
}
