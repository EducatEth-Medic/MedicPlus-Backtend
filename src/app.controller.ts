import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { EncriptDataDto } from './dtos/app.dto';

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/block-number')
  async getBlockNumber() {
    return await this.appService.getBlockNumber();
  }

  @Post('/encrypt-data')
  async encryptData(@Body() body: EncriptDataDto) {
    return await this.appService.encryptData(body.data);
  }

  @Post('/decrypt-data')
  async decryptData(@Body() body: EncriptDataDto) {
    return await this.appService.decryptData(body.data);
  }
}
