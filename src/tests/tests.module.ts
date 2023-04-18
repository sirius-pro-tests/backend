import { Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { QuestionsController } from 'src/tests/questions.controller';
import { QuestionsService } from 'src/tests/questions.service';
import { TestsController } from 'src/tests/tests.controller';
import { TestsService } from 'src/tests/tests.service';

@Module({
    imports: [IdentityModule],
    providers: [TestsService, QuestionsService],
    controllers: [TestsController, QuestionsController],
})
export class TestsModule {}
