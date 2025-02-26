import { ApiProperty } from '@nestjs/swagger';

export class RecipientResponse {
  @ApiProperty()
  recipients?: string[];

  @ApiProperty()
  error?: string;

  @ApiProperty()
  statusCode?: number;
}
