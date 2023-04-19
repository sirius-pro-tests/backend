import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Test, User } from '@prisma/client';
import { SubmitResultBodySchema } from './attempts.dtos';
import { TestsService } from 'src/tests/tests.service';
import { UsersService } from 'src/identity/users.service';
import { QuestionsService } from 'src/tests/questions/questions.service';
import { AttemptAnswerSchema } from 'src/tests/attempts/attempt.schema';

@Injectable()
export class AttemptsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly testsService: TestsService,
        private readonly questionsService: QuestionsService,
        private readonly usersService: UsersService
    ) {}

    async getResult(testId: Test['id'], userId: User['id']) {
        await this.testsService.getById(testId);

        await this.usersService.getById(userId);

        const result = await this.prisma.attempt.findFirst({
            where: { testId, userId },
        });

        if (!result) {
            throw new HttpException(
                'Попытка не найдена',
                HttpStatus.NO_CONTENT,
                { description: 'HAS_NO_ATTEMPT' }
            );
        }

        return result;
    }

    async submitResult(
        testId: Test['id'],
        userId: User['id'],
        submitted: SubmitResultBodySchema
    ) {
        const questions = await this.questionsService.getQuestionsSchemas(
            testId
        );

        const results: AttemptAnswerSchema[] = questions.map((question) => {
            const right = question.payload.variants.find(
                (variant) => variant.right === true
            );

            if (!right) {
                throw new InternalServerErrorException(
                    'У вопроса нет правильного ответа'
                );
            }

            const answer = submitted.find(
                (submit) => submit.title === question.title
            );

            if (!answer) {
                throw new InternalServerErrorException(
                    'Прислан ответ на несуществующий вопрос'
                );
            }

            return {
                question: question.title,
                answer: answer.answer,
                right: answer.answer === right.answer,
            };
        });

        await this.prisma.attempt.create({
            data: { testId, userId, results },
        });

        return this.getResult(testId, userId);
    }
}
