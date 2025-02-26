import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotificationRecipientDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Teacher email must be a valid email address.' })
  @IsNotEmpty({ message: 'Teacher email is required and cannot be empty.' })
  teacher: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Notification is required and cannot be empty.' })
  notification: string;
}
