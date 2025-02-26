import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { TeachersOnStudents } from './teachersOnStudents.entity';

export class Teacher {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  user?: User;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  students?: TeachersOnStudents[];
}
