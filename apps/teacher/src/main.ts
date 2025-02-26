import { NestFactory } from '@nestjs/core';
import { TeacherModule } from './teacher.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TeacherModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: Number(process.env.TEACHER_PORT),
      },
    },
  );

  await app.listen();

  Logger.log(
    `🚀 Teacher microservice is listening at http://${process.env.HOST}:${process.env.TEACHER_PORT}`,
  );
}

bootstrap();
