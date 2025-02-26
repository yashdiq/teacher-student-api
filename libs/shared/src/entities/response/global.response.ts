import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty()
  message?: string | string[];

  @ApiProperty()
  data?: T;

  @ApiProperty()
  error?: string;

  @ApiProperty()
  statusCode?: number;
}
