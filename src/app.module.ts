import { HttpException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { PrismaModule } from 'nestjs-prisma';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { IdentityModule } from 'src/identity/identity.module';
import { TestsModule } from 'src/tests/tests.module';

const envConfigScheme = z.object({
    DATABASE_URL: z.string(),
    API_PORT: z.string(),
    JWT_SECRET: z.string(),
    SENTRY_DSN: z.string(),
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
        SentryModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dsn: configService.get<string>('SENTRY_DSN'),
                tracesSampleRate: 1.0,
                close: {
                    enabled: true,
                },
            }),
        }),
        IdentityModule,
        TestsModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useFactory: () =>
                new SentryInterceptor({
                    filters: [
                        {
                            type: HttpException,
                            filter: (exception: HttpException) =>
                                exception.getStatus() < 500,
                        },
                    ],
                }),
        },
    ],
})
export class AppModule {}
