import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '@app/shared';
import { RegisterStudentsDto } from '@app/shared/dto/register-students.dto';
import { NotificationRecipientDto } from '@app/shared/dto/notification-recipient.dto';
import { SuspendStudentDto } from '@app/shared/dto/suspend-student.dto';

describe('TeacherService', () => {
  let service: TeacherService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: PrismaService,
          useValue: {
            teacher: { update: jest.fn(), findUnique: jest.fn() },
            teachersOnStudents: { groupBy: jest.fn() },
            student: { update: jest.fn(), findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should register students successfully', async () => {
      const dto: RegisterStudentsDto = {
        teacher: 'john.doe@elm.ai',
        students: ['mark@elm.ai', 'harris@elm.ai'],
      };

      const mockResponse = {
        email: dto.teacher,
        students: dto.students.map((email) => ({ studentEmail: email })),
      };

      jest
        .spyOn(prisma.teacher, 'update')
        .mockResolvedValue(mockResponse as any);

      const result = await service.register(dto);

      expect(result).toEqual({ data: mockResponse });
      expect(prisma.teacher.update).toHaveBeenCalledWith({
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
    });

    it('should throw error if teacher not found', async () => {
      const dto: RegisterStudentsDto = {
        teacher: 'invalid@elm.ai',
        students: ['mark@elm.ai'],
      };

      const notFoundError = new PrismaClientKnownRequestError(
        'Teacher not found',
        { code: 'P2025', clientVersion: '4.0' },
      );

      jest.spyOn(prisma.teacher, 'update').mockRejectedValue(notFoundError);

      await expect(service.register(dto)).rejects.toThrow(
        'Teacher not found. Please check the provided information.',
      );
    });
  });

  describe('getCommonStudents', () => {
    it('should return only common students among the given teachers', async () => {
      const teachers = ['teacher1@elm.ai', 'teacher2@elm.ai'];
      const mockCommonStudents = [
        { studentEmail: 'student1@elm.ai' },
        { studentEmail: 'student2@elm.ai' },
      ];

      (prisma.teachersOnStudents.groupBy as jest.Mock).mockResolvedValue(
        mockCommonStudents,
      );

      const result = await service.getCommonStudents(teachers);
      expect(result).toEqual({
        students: ['student1@elm.ai', 'student2@elm.ai'],
      });
      expect(prisma.teachersOnStudents.groupBy).toHaveBeenCalledWith({
        by: ['studentEmail'],
        where: { teacherEmail: { in: teachers } },
        having: { teacherEmail: { _count: { equals: teachers.length } } },
      });
    });
  });

  describe('suspend', () => {
    it('should suspend a student successfully', async () => {
      const dto: SuspendStudentDto = { student: 'student@elm.ai' };

      (prisma.student.update as jest.Mock).mockResolvedValue({
        email: dto.student,
        user: { status: 'Suspended' },
      });

      const result = await service.suspend(dto);
      expect(result).toEqual({
        data: { email: dto.student, user: { status: 'Suspended' } },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { email: dto.student },
        data: { user: { update: { status: 'Suspended' } } },
      });
    });
  });

  describe('retrieveRecipients', () => {
    it('should return recipients of a notification', async () => {
      const dto: NotificationRecipientDto = {
        teacher: 'teacher@elm.ai',
        notification: 'Hello @student1@elm.ai @student2@elm.ai',
      };

      const mockTeacher = {
        students: [{ studentEmail: 'student3@elm.ai' }],
      };

      (prisma.teacher.findUnique as jest.Mock).mockResolvedValue(mockTeacher);
      (prisma.student.findMany as jest.Mock).mockResolvedValue([
        { email: 'student1@elm.ai' },
        { email: 'student2@elm.ai' },
        { email: 'student3@elm.ai' },
      ]);

      const result = await service.retrieveRecipients(dto);
      expect(result).toEqual({
        recipients: ['student1@elm.ai', 'student2@elm.ai', 'student3@elm.ai'],
      });

      expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
        where: { email: dto.teacher },
        select: { students: true },
      });

      expect(prisma.student.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            in: ['student1@elm.ai', 'student2@elm.ai', 'student3@elm.ai'],
          },
          user: { status: 'Active' },
        },
      });
    });
  });
});
