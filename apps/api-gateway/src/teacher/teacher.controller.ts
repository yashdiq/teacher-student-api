import { JwtAuthGuard, TeacherGuard } from '@app/shared';
import { NotificationRecipientDto } from '@app/shared/dto/notification-recipient.dto';
import { RegisterStudentsDto } from '@app/shared/dto/register-students.dto';
import { SuspendStudentDto } from '@app/shared/dto/suspend-student.dto';
import {
  RecipientResponse,
  Response,
  StudentResponse,
} from '@app/shared/entities';
import { Student } from '@app/shared/entities/student.entity';
import { Teacher } from '@app/shared/entities/teacher.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard, TeacherGuard)
@ApiBearerAuth()
@Controller('api')
@ApiTags('Teachers')
export class TeacherController {
  constructor(
    @Inject('teacher_service') private readonly teacherClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiNoContentResponse({ type: Response<Teacher> })
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() body: RegisterStudentsDto) {
    try {
      const res = this.teacherClient.send('register', { body });
      const result = await lastValueFrom(res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('commonstudents')
  @ApiOkResponse({ type: StudentResponse })
  @HttpCode(HttpStatus.OK)
  async findCommonStudents(@Query('teacher') teachers: string | string[]) {
    try {
      const teacherList = teachers
        ? Array.isArray(teachers)
          ? teachers
          : [teachers]
        : [];

      const res = this.teacherClient.send('commonstudents', {
        teachers: teacherList,
      });
      const result = await lastValueFrom(res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('suspend')
  @ApiNoContentResponse({ type: Response<Student> })
  @HttpCode(HttpStatus.NO_CONTENT)
  async suspend(@Body() body: SuspendStudentDto) {
    try {
      const res = this.teacherClient.send('suspend', { body });
      const result = await lastValueFrom(res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('retrievefornotifications')
  @ApiOkResponse({ type: RecipientResponse })
  @HttpCode(HttpStatus.OK)
  async retrieveNotificationRecipients(@Body() body: NotificationRecipientDto) {
    try {
      const res = this.teacherClient.send('retrievefornotifications', { body });
      const result = await lastValueFrom(res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
