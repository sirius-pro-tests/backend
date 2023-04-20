import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { zodToOpenAPI } from 'nestjs-zod';
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/identity/auth.guard';
import { InjectUser } from 'src/identity/user.decorator';
import { TestsService } from '../tests.service';
import { QuestionsService } from './questions.service';
import {
    questionPayloadOmittedSchema,
    questionPayloadFullSchema,
} from './question.schema';
import {
    GetQuestionsResponseSchema,
    getQuestionsResponseSchema,
    CreateQuestionBodyDto,
    createQuestionBodySchema,
    createQuestionResponseSchema,
    CreateQuestionResponseSchema,
    getQuestionsNotFoundErrorSchema,
    createQuestionForbiddenErrorSchema,
} from './questions.dtos';

@ApiTags('Tests', 'Questions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tests')
export class QuestionsController {
    constructor(
        private readonly questionsService: QuestionsService,
        private readonly testsService: TestsService
    ) {}

    @Get(':id/questions')
    @ApiParam({ name: 'id', description: 'ID теста' })
    @ApiOperation({
        description: 'Возвращает список вопросов для выбранного теста',
    })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse({
        schema: zodToOpenAPI(getQuestionsNotFoundErrorSchema),
    })
    @ApiOkResponse({
        schema: zodToOpenAPI(getQuestionsResponseSchema),
    })
    async getQuestions(
        @Param('id') testId: string,
        @InjectUser() user: User
    ): Promise<GetQuestionsResponseSchema> {
        const questions = await this.questionsService.getQuestions(
            Number(testId)
        );

        const schema = (await this.testsService.isAuthor(
            user.id,
            Number(testId)
        ))
            ? questionPayloadFullSchema
            : questionPayloadOmittedSchema;

        return questions.map((question) => ({
            id: question.id,
            title: question.title,
            payload: schema.parse(question.payload),
        }));
    }

    @Post(':id/questions')
    @ApiOperation({ description: 'Добавляет вопрос в тест' })
    @ApiParam({ name: 'id', description: 'ID теста' })
    @ApiBody({ schema: zodToOpenAPI(createQuestionBodySchema) })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse({
        schema: zodToOpenAPI(getQuestionsNotFoundErrorSchema),
    })
    @ApiForbiddenResponse({
        schema: zodToOpenAPI(createQuestionForbiddenErrorSchema),
    })
    @ApiOkResponse({ schema: zodToOpenAPI(createQuestionResponseSchema) })
    async addQuestion(
        @Param('id') testId: string,
        @Body() { title, payload }: CreateQuestionBodyDto,
        @InjectUser() user: User
    ): Promise<CreateQuestionResponseSchema> {
        const created = await this.questionsService.createQuestion(
            Number(testId),
            user.id,
            payload,
            title
        );

        return {
            id: created.id,
            title: created.title,
            payload: questionPayloadFullSchema.parse(created.payload),
        };
    }
}
