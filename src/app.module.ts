import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
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
})
export class AppModule {}
