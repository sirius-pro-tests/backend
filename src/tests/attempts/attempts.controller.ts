import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { zodToOpenAPI } from 'nestjs-zod';
import { AuthGuard } from 'src/identity/auth.guard';
import { InjectUser } from 'src/identity/user.decorator';
import {
    getResultResponseSchema,
    GetResultResponseSchema,
    SubmitResultBodySchema,
    submitResultBodySchema,
} from 'src/tests/attempts/attempts.dtos';
import { AttemptsService } from './attempts.service';

@Controller('tests')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Tests', 'Attempts')
export class AttemptsController {
    constructor(private readonly attemptsService: AttemptsService) {}

    @Get(':id/attempt')
    @ApiOperation({ description: 'Получить результаты сдачи теста' })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiNoContentResponse({ description: 'Тест еще не был пройден' })
    @ApiOkResponse({ schema: zodToOpenAPI(getResultResponseSchema) })
    async getAttemptResult(
        @Param('id') testId: string,
        @InjectUser() user: User
    ): Promise<GetResultResponseSchema> {
        const result = await this.attemptsService.getResult(
            Number(testId),
            user.id
        );

        return getResultResponseSchema.parse(result);
    }

    @Post(':id/attempt')
    @ApiOperation({ description: 'Оправить результаты на проверку' })
    @ApiBody({ schema: zodToOpenAPI(submitResultBodySchema) })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(getResultResponseSchema) })
    async submitAttempt(
        @Param('id') testId: string,
        @InjectUser() user: User,
        @Body() submitted: SubmitResultBodySchema
    ): Promise<GetResultResponseSchema> {
        const { results } = await this.attemptsService.submitResult(
            Number(testId),
            user.id,
            submitted
        );

        console.log(results);

        return getResultResponseSchema.parse(results);
    }
}
