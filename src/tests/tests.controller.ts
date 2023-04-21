import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
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
import { TestsService } from './tests.service';
import {
    CreateTestBodyDto,
    CreateTestResponseSchema,
    GetTestByIdSchema,
    GetOwnedTestsSchema,
    getInvitedTestsSchema,
    getOwnedTestsSchema,
    createTestResponseSchema,
    getTestByIdSchema,
    GetSubmittedTestsSchema,
    getSubmittedTestsSchema,
} from './tests.dtos';

@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tests')
export class TestsController {
    constructor(private readonly testsService: TestsService) {}

    @Get('owned')
    @ApiOperation({
        description: 'Отдает тесты которые создал текущий пользователь',
    })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(getOwnedTestsSchema) })
    async getOwned(
        @InjectUser() user: User
    ): Promise<Array<GetOwnedTestsSchema>> {
        const owned = await this.testsService.getOwned(user);

        return owned.map(
            ({ id, description, title, author }): GetOwnedTestsSchema => ({
                id,
                title,
                description,
                author: { id: author.id, fullName: author.fullName },
            })
        );
    }

    @Get('invited')
    @ApiOperation({
        description: 'Отдает тесты в которые пригласили пользователя',
        deprecated: true,
    })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(getInvitedTestsSchema) })
    async getInvited(
        @InjectUser() user: User
    ): Promise<Array<GetTestByIdSchema>> {
        const invited = await this.testsService.getInvited(user);

        return invited.map(
            ({ id, description, title, author }): GetTestByIdSchema => ({
                id,
                title,
                description,
                author: { id: author.id, fullName: author.fullName },
            })
        );
    }

    @Get('submitted')
    @ApiOkResponse({ schema: zodToOpenAPI(getSubmittedTestsSchema) })
    async getSubmitted(
        @InjectUser() user: User
    ): Promise<GetSubmittedTestsSchema> {
        const tests = await this.testsService.getSubmitted(user.id);

        return tests.map((test) => ({
            id: test.id,
            title: test.title,
            description: test.description,
            author: {
                id: test.author.id,
                fullName: test.author.fullName,
            },
        }));
    }

    @Get(':id')
    @ApiOperation({ description: 'Отдает информацию о тесте по ID' })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(getTestByIdSchema) })
    async getById(@Param('id') testId: string): Promise<GetTestByIdSchema> {
        const test = await this.testsService.getById(Number(testId));

        return {
            id: test.id,
            title: test.title,
            description: test.description,
            author: {
                id: test.author.id,
                fullName: test.author.fullName,
            },
        };
    }

    @Post()
    @ApiOperation({ description: 'Создает тест' })
    @ApiUnauthorizedResponse()
    @ApiOkResponse({ schema: zodToOpenAPI(createTestResponseSchema) })
    async create(
        @InjectUser() user: User,
        @Body() body: CreateTestBodyDto
    ): Promise<CreateTestResponseSchema> {
        const { id, title, description, author } =
            await this.testsService.create(user, body.title, body.description);

        return {
            id,
            title,
            description,
            author: { id: author.id, fullName: author.fullName },
        };
    }

    @Delete(':id')
    @ApiOperation({ description: 'Удаляет тест' })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiOkResponse()
    async delete(@InjectUser() user: User, @Param('id') testId: string) {
        const test = await this.testsService.getById(Number(testId));

        if (!(await this.testsService.isAuthor(user.id, test.id))) {
            throw new ForbiddenException('Вы не автор теста');
        }

        await this.testsService.deleteTestById(Number(testId));
    }
}
