import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
    questionFullSchema,
    QuestionFullSchema,
    QuestionPayloadOmittedSchema,
} from 'src/tests/questions/question.schema';
import { TestsService } from 'src/tests/tests.service';

@Injectable()
export class QuestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly testsService: TestsService
    ) {}

    async getQuestions(testId: number) {
        await this.testsService.getById(testId);

        const questions = await this.prisma.question.findMany({
            where: { testId },
        });

        return questions;
    }

    async getQuestionsSchemas(testId: number): Promise<QuestionFullSchema[]> {
        const questions = await this.getQuestions(testId);

        return questions.map(({ id, title, payload }) =>
            questionFullSchema.parse({ id, title, payload })
        );
    }

    async createQuestion(
        testId: number,
        userId: User['id'],
        payload: QuestionPayloadOmittedSchema,
        title: string
    ) {
        await this.testsService.getById(testId);

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
