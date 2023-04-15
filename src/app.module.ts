import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { IdentityModule } from 'src/identity/identity.module';
import { TestsModule } from 'src/tests/tests.module';

const envConfigScheme = z.object({
    DATABASE_URL: z.string(),
    API_PORT: z.string(),
    JWT_SECRET: z.string(),
});

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (config) => envConfigScheme.parse(config),
            isGlobal: true,
        }),
        PrismaModule.forRoot({
            isGlobal: true,
        }),
        IdentityModule,
        TestsModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
