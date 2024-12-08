import { ApiProperty } from '@nestjs/swagger';

export class EncriptDataDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  data: string;
}
