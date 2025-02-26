import { Controller } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterStudentsDto } from '@app/shared/dto/register-students.dto';
import { SuspendStudentDto } from '@app/shared/dto/suspend-student.dto';
import { NotificationRecipientDto } from '@app/shared/dto/notification-recipient.dto';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @MessagePattern('register')
  register(@Payload('body') body: RegisterStudentsDto) {
    return this.teacherService.register(body);
  }

  @MessagePattern('commonstudents')
  getCommonStudents(@Payload('teachers') teachers: string[]) {
    return this.teacherService.getCommonStudents(teachers);
  }

  @MessagePattern('suspend')
  suspend(@Payload('body') body: SuspendStudentDto) {
    return this.teacherService.suspend(body);
  }

  @MessagePattern('retrievefornotifications')
  retrieveNotificationRecipients(
    @Payload('body') body: NotificationRecipientDto,
  ) {
    return this.teacherService.retrieveRecipients(body);
  }
}
