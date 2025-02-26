import { PrismaErrorHandler, PrismaService } from '@app/shared';
import { NotificationRecipientDto } from '@app/shared/dto/notification-recipient.dto';
import { RegisterStudentsDto } from '@app/shared/dto/register-students.dto';
import { SuspendStudentDto } from '@app/shared/dto/suspend-student.dto';
import { extractMentionedEmails } from '@app/shared/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  /**
   * Register one or more students to a specified teacher
   * @param dto: RegisterStudentsDto
   * @returns Response<Teacher>
   */
  async register(dto: RegisterStudentsDto) {
    try {
      const data = await this.prisma.teacher.update({
        where: { email: dto.teacher },
        data: {
          students: {
            createMany: {
              data: dto.students.map((email) => ({ studentEmail: email })),
              skipDuplicates: true,
            },
          },
        },
      });

      return { data };
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Teacher');
    }
  }

  /**
   * Retrieve a list of students common to a list of teachers
   * @param teachers: string[]
   * @returns StudentResponse
   */
  async getCommonStudents(teachers: string[]) {
    try {
      const commonStudents = await this.prisma.teachersOnStudents.groupBy({
        by: ['studentEmail'],
        where: { teacherEmail: { in: teachers } },
        having: { teacherEmail: { _count: { equals: teachers.length } } },
      });

      const students = commonStudents.map(({ studentEmail }) => studentEmail);

      return { students };
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Student');
    }
  }

  /**
   * Suspend a student
   * @param dto: SuspendStudentDto
   * @returns Response<Student>
   */
  async suspend(dto: SuspendStudentDto) {
    try {
      const data = await this.prisma.student.update({
        where: { email: dto.student },
        data: { user: { update: { status: 'Suspended' } } },
      });

      return { data };
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Student');
    }
  }

  /**
   * Retrieve a list of students who are recipients of a notification
   * @param dto: NotificationRecipientDto
   * @returns RecipientResponse
   */
  async retrieveRecipients(dto: NotificationRecipientDto) {
    try {
      const extractedEmails = extractMentionedEmails(dto.notification);

      const teacher = await this.prisma.teacher.findUnique({
        where: { email: dto.teacher },
        select: { students: true },
      });

      const students = teacher?.students ?? [];
      const studentEmails = students.map((student) => student.studentEmail);

      const recipients = await this.prisma.student.findMany({
        where: {
          email: { in: [...extractedEmails, ...studentEmails] },
          user: { status: 'Active' },
        },
      });

      return { recipients: recipients.map((student) => student.email) };
    } catch (error) {
      PrismaErrorHandler.handle(error, 'Teacher');
    }
  }
}
