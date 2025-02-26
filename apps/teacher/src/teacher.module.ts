import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
