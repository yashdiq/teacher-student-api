import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { MicroserviceExceptionFilter } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new MicroserviceExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('ELM')
    .setDescription('Teachers and Students API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', apiReference({ spec: { content: document } }));

  app.enableCors();

  const port = 4200;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://${process.env.HOST}:${port}`,
  );
}
bootstrap();
