import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TeachersOnStudents {
  @ApiProperty()
  teacher?: Teacher;
  @ApiProperty()
  teacherEmail: number;
  @ApiProperty()
  student?: Student;
  @ApiProperty()
  studentEmail: number;
}
