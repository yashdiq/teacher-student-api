import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendStudentDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Student email must be a valid email address.' })
  @IsNotEmpty({ message: 'Student email is required and cannot be empty.' })
  student: string;
}
