import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterStudentsDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Teacher email must be a valid email address.' })
  @IsNotEmpty({ message: 'Teacher email is required and cannot be empty.' })
  teacher: string;

  @ApiProperty()
  @IsArray({ message: 'Students must be a list of emails.' })
  @ArrayNotEmpty({ message: 'Students cannot be empty.' })
  @IsEmail(
    {},
    {
      each: true,
      message: 'Each student email must be a valid email address.',
    },
  )
  @IsNotEmpty({ each: true, message: 'Student email cannot be empty.' })
  students: string[];
}
