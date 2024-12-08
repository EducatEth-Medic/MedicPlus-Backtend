import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  secretKey: string;
  AES: any;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>(
        'RPC_ENDPOINT_URL',
        process.env.RPC_ENDPOINT_URL,
      ),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>(
        'PRIVATE_KEY',
        process.env.PRIVATE_KEY || 'f'.repeat(64),
      ),
      this.provider,
    );

    this.secretKey = this.configService.get<string>(
      'PRIVATE_KEY',
      process.env.SECRET_KEY || 'x'.repeat(64),
    );

    this.AES = require('crypto-js/aes');
  }

  getHello(): string {
    return 'Main Backend App Running OK. Go to .../docs/ for more!';
  }

  async getBlockNumber() {
    const { provider } = this;
    const blkNum = await provider.getBlockNumber();
    const lastBlkNum = blkNum | 0;
    return lastBlkNum;
  }

  async encryptData(data: string) {
    try {
      if (this.secretKey === 'x'.repeat(64)) {
        console.error('Error con la secretkey de encriptacion');
        return;
      }
      return this.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async decryptData(data: string) {
    try {
      return JSON.parse(this.AES.decrypt(data, this.secretKey).toString());
    } catch (e) {
      return new BadRequestException(e);
    }
  }
}
