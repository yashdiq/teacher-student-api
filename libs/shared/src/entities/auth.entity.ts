import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class AuthEntity {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  accessToken?: string;

  @ApiProperty()
  user?: Omit<User, 'password' | 'status' | 'createdAt' | 'updatedAt'>;

  @ApiProperty()
  error?: string;
}
