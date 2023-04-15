import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from './app.module';

patchNestJsSwagger();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/api/v1');

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Pro-tests API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, swaggerDocument);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<string>('API_PORT');

    await app.listen(port);
}

bootstrap();
