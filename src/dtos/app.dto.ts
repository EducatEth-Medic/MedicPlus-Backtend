import { ApiProperty } from '@nestjs/swagger';

export class EncriptDataDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
    description: 'The data to be encrypted or decrypted',
  })
  data: string;
}

export class UploadCaseDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  cid: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  description: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  patient: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  issueDate: number;
}

export class EditCaseDto {
  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  caseId: number;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  cid: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  description: string;
}

export class GrantPermissionDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  recipient: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  expiration: number;
}

export class GrantCasePermissionDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  recipient: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  caseId: number;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  expiration: number;
}

export class RevokePermissionDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  recipient: string;
}

export class RevokeCasePermissionDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  recipient: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  caseId: number;
}

export class HasAccessDto {
  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  patient: string;

  @ApiProperty({
    type: String,
    required: true,
    default: '',
  })
  recipient: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 0,
  })
  caseId: number;
}
