import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { AuthGuard } from 'src/identity/auth.guard';
import {
    getQuestionsOfTestResponseSchema,
    GetQuestionsOfTestResponseSchema,
} from './questions.dtos';

@ApiTags('Tests', 'Questions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tests')
export class QuestionsController {
    @Get(':id/questions')
    @ApiOperation({
        description: 'Возвращает список вопросов для выбранного теста',
    })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(getQuestionsOfTestResponseSchema) })
    async getQuestions(): Promise<Array<GetQuestionsOfTestResponseSchema>> {
        return [];
    }
}
