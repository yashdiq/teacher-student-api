import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from '@app/shared';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'teacher_service',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: Number(process.env.TEACHER_PORT),
        },
      },
    ]),
    SharedModule,
  ],
  controllers: [TeacherController],
  providers: [JwtService],
})
export class TeacherModule {}
