import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/identity/auth.guard';
import { TestsService } from 'src/tests/tests.service';

@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tests')
export class TestsController {
    constructor(private readonly testsService: TestsService) {}

    @Get()
    getAll() {
        return this.testsService.getAll();
    }
}
