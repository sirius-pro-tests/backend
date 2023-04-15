import { Module } from '@nestjs/common';
import { IdentityModule } from 'src/identity/identity.module';
import { QuestionsController } from 'src/tests/questions.controller';
import { TestsController } from 'src/tests/tests.controller';
import { TestsService } from 'src/tests/tests.service';

@Module({
    imports: [IdentityModule],
    providers: [TestsService],
    controllers: [TestsController, QuestionsController],
})
export class TestsModule {}
