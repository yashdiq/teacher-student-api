import { Role } from './role.entity';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  role?: Role;
  @ApiProperty()
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
  teachers?: Teacher[];
  students?: Student[];
}
