import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  EncriptDataDto,
  UploadCaseDto,
  EditCaseDto,
  GrantPermissionDto,
  GrantCasePermissionDto,
  RevokePermissionDto,
  RevokeCasePermissionDto,
  HasAccessDto,
} from './dtos/app.dto';

@ApiTags('MedicPlus API')
@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get the status of the application' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('block-number')
  @ApiOperation({ summary: 'Get the latest block number' })
  @ApiResponse({ status: 200, description: 'Latest block number retrieved' })
  async getBlockNumber(): Promise<number> {
    return this.appService.getBlockNumber();
  }

  @Post('encrypt')
  @ApiOperation({ summary: 'Encrypt data using AES' })
  @ApiResponse({ status: 200, description: 'Encrypted data returned' })
  async encryptData(@Body() body: EncriptDataDto): Promise<string> {
    return this.appService.encryptData(body.data);
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Decrypt data using AES' })
  @ApiResponse({ status: 200, description: 'Decrypted data returned' })
  async decryptData(@Body() body: EncriptDataDto): Promise<any> {
    return this.appService.decryptData(body.data);
  }

  @Post('upload-case')
  @ApiOperation({ summary: 'Upload a new medical case' })
  @ApiResponse({ status: 200, description: 'Case uploaded successfully' })
  async uploadCase(@Body() body: UploadCaseDto) {
    return this.appService.uploadCase(
      body.cid,
      body.name,
      body.description,
      body.patient,
      body.issueDate,
    );
  }

  @Post('edit-case')
  @ApiOperation({ summary: 'Edit an existing medical case' })
  @ApiResponse({ status: 200, description: 'Case edited successfully' })
  async editCase(@Body() body: EditCaseDto) {
    return this.appService.editCase(
      body.caseId,
      body.cid,
      body.name,
      body.description,
    );
  }

  @Post('grant-full-permission')
  @ApiOperation({ summary: 'Grant full permission to a recipient' })
  @ApiResponse({ status: 200, description: 'Full permission granted' })
  async grantFullPermission(@Body() body: GrantPermissionDto) {
    return this.appService.grantFullPermission(
      body.patient,
      body.recipient,
      body.expiration,
    );
  }

  @Post('grant-case-permission')
  @ApiOperation({ summary: 'Grant case permission to a recipient' })
  @ApiResponse({ status: 200, description: 'Case permission granted' })
  async grantCasePermission(@Body() body: GrantCasePermissionDto) {
    return this.appService.grantCasePermission(
      body.patient,
      body.recipient,
      body.caseId,
      body.expiration,
    );
  }

  @Post('revoke-full-permission')
  @ApiOperation({ summary: 'Revoke full permission from a recipient' })
  @ApiResponse({ status: 200, description: 'Full permission revoked' })
  async revokeFullPermission(@Body() body: RevokePermissionDto) {
    return this.appService.revokeFullPermission(body.recipient);
  }

  @Post('revoke-case-permission')
  @ApiOperation({ summary: 'Revoke case permission from a recipient' })
  @ApiResponse({ status: 200, description: 'Case permission revoked' })
  async revokeCasePermission(@Body() body: RevokeCasePermissionDto) {
    return this.appService.revokeCasePermission(body.recipient, body.caseId);
  }

  @Get('has-access')
  @ApiOperation({ summary: 'Check if a recipient has access to a case' })
  @ApiQuery({ name: 'patient', required: true })
  @ApiQuery({ name: 'recipient', required: true })
  @ApiQuery({ name: 'caseId', required: true })
  @ApiResponse({ status: 200, description: 'Access status returned' })
  async hasAccess(@Query() query: HasAccessDto) {
    return this.appService.hasAccess(
      query.patient,
      query.recipient,
      query.caseId,
    );
  }

  @Get('get-patient-cases')
  @ApiOperation({ summary: 'Get all cases for a patient' })
  @ApiQuery({ name: 'patient', required: true })
  @ApiResponse({ status: 200, description: 'List of cases returned' })
  async getAllCases(@Query('patient') patient: string) {
    return this.appService.getAllCases(patient);
  }

  @Get('get-case/:caseId')
  @ApiOperation({ summary: 'Get details of a specific case' })
  @ApiResponse({ status: 200, description: 'Case details returned' })
  async getCase(@Param('caseId') caseId: number) {
    return this.appService.getCase(caseId);
  }

  @Get('is-full-permission-active')
  @ApiOperation({ summary: 'Check if full permission is active for a case' })
  @ApiQuery({ name: 'recipient', required: true })
  @ApiQuery({ name: 'patient', required: true })
  @ApiQuery({ name: 'caseId', required: true })
  @ApiResponse({ status: 200, description: 'Permission status returned' })
  async isFullPermissionActive(
    @Query('recipient') recipient: string,
    @Query('patient') patient: string,
    @Query('caseId') caseId: number,
  ) {
    return this.appService.isFullPermissionActive(recipient, patient, caseId);
  }

  @Get('is-temporary-permission-active')
  @ApiOperation({
    summary: 'Check if temporary permission is active for a case',
  })
  @ApiQuery({ name: 'recipient', required: true })
  @ApiQuery({ name: 'patient', required: true })
  @ApiQuery({ name: 'caseId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Temporary permission status returned',
  })
  async isTemporaryPermissionActive(
    @Query('recipient') recipient: string,
    @Query('patient') patient: string,
    @Query('caseId') caseId: number,
  ) {
    return this.appService.isTemporaryPermissionActive(
      recipient,
      patient,
      caseId,
    );
  }
}
