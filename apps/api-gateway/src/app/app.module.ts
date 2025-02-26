import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [AuthModule, TeacherModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
