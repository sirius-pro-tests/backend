import { Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { TestsService } from './tests.service';
import { QuestionsService } from './questions/questions.service';
import { AttemptsService } from './attempts/attempts.service';
import { TestsController } from './tests.controller';
import { QuestionsController } from './questions/questions.controller';
import { AttemptsController } from './attempts/attempts.controller';

@Module({
    imports: [IdentityModule],
    providers: [TestsService, QuestionsService, AttemptsService],
    controllers: [TestsController, QuestionsController, AttemptsController],
})
export class TestsModule {}
