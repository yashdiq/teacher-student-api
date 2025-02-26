import { ApiProperty } from '@nestjs/swagger';

export class StudentResponse {
  @ApiProperty()
  students?: string[];

  @ApiProperty()
  error?: string;

  @ApiProperty()
  statusCode?: number;
}
