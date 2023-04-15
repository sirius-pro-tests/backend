import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/identity/auth.guard';
import { InjectUser } from 'src/identity/user.decorator';
import { TestsService } from 'src/tests/tests.service';

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
    @ApiOkResponse()
    getOwned(@InjectUser() user: User) {
        return this.testsService.getOwned(user);
    }

    @Get('invited')
    @ApiOperation({
        description: 'Отдает тесты в которые пригласили пользователя',
    })
    @ApiUnauthorizedResponse()
    @ApiOkResponse()
    getInvited(@InjectUser() user: User) {
        return this.testsService.getInvited(user);
    }
}
