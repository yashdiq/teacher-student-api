import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required and cannot be empty.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required and cannot be empty.' })
  password: string;
}
