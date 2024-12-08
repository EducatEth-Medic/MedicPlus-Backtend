import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as medicPlusManagerAbi from './assets/MedicPlusManager.json';

@Injectable()
export class AppService {
  mpManagerContract: ethers.Contract;
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

    this.mpManagerContract = new ethers.Contract(
      this.configService.get<string>(
        'CONTRACT_ADDR',
        process.env.CONTRACT_ADDR || ethers.ZeroAddress,
      ),
      medicPlusManagerAbi,
      this.wallet,
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
      throw new BadRequestException('Error al encriptar los datos');
    }
  }

  async decryptData(data: string) {
    try {
      return JSON.parse(this.AES.decrypt(data, this.secretKey).toString());
    } catch (e) {
      throw new BadRequestException('Error al desencriptar los datos');
    }
  }

  // Métodos para interactuar con el contrato inteligente:

  async uploadCase(
    cid: string,
    name: string,
    description: string,
    patient: string,
    issueDate: number,
  ) {
    const tx = await this.mpManagerContract.uploadCase(
      cid,
      name,
      description,
      patient,
      issueDate,
    );
    await tx.wait();
    return tx;
  }

  async editCase(
    caseId: number,
    cid: string,
    name: string,
    description: string,
  ) {
    const tx = await this.mpManagerContract.editCase(
      caseId,
      cid,
      name,
      description,
    );
    await tx.wait();
    return tx;
  }

  async grantFullPermission(recipient: string, expiration: number) {
    const tx = await this.mpManagerContract.grantFullPermission(
      recipient,
      expiration,
    );
    await tx.wait();
    return tx;
  }

  async grantCasePermission(
    recipient: string,
    caseId: number,
    expiration: number,
  ) {
    const tx = await this.mpManagerContract.grantCasePermission(
      recipient,
      caseId,
      expiration,
    );
    await tx.wait();
    return tx;
  }

  async revokeFullPermission(recipient: string) {
    const tx = await this.mpManagerContract.revokeFullPermission(recipient);
    await tx.wait();
    return tx;
  }

  async revokeCasePermission(recipient: string, caseId: number) {
    const tx = await this.mpManagerContract.revokeCasePermission(
      recipient,
      caseId,
    );
    await tx.wait();
    return tx;
  }

  async hasAccess(patient: string, recipient: string, caseId: number) {
    const hasAccess = await this.mpManagerContract.hasAccess(
      patient,
      recipient,
      caseId,
    );
    return hasAccess;
  }

  serializeCase = (caseItem: any) => {
    return {
      caseId: caseItem[0].toString(),
      issueDate: caseItem[1].toString(),
      cids: caseItem[2].map((id) => id.toString()),
      name: caseItem[3],
      description: caseItem[4],
      patientAddress: caseItem[5],
      exists: caseItem[6],
    };
  };

  async getAllCases(patient: string) {
    const cases = await this.mpManagerContract.getAllCases(patient);

    console.log(cases);
    // console.log(cases[0][1]);

    // Convertir los valores de BigInt a string dentro de cada Result
    const serializedCases = cases.map((caseItem) => {
      // Mapeamos cada caseItem y convertimos los BigInt a string
      return this.serializeCase(caseItem);
    });

    return serializedCases;
  }

  async getCase(caseId: number) {
    const caseDetails = await this.mpManagerContract.getCase(caseId);
    const serializedCase = this.serializeCase(caseDetails);

    // console.log(serializedCase);
    return serializedCase;
  }

  async isFullPermissionActive(
    recipient: string,
    patient: string,
    caseId: number,
  ) {
    const isActive = await this.mpManagerContract.isFullPermissionActive(
      recipient,
      patient,
      caseId,
    );
    return isActive;
  }

  async isTemporaryPermissionActive(
    recipient: string,
    patient: string,
    caseId: number,
  ) {
    const isActive = await this.mpManagerContract.isTemporaryPermissionActive(
      recipient,
      patient,
      caseId,
    );
    return isActive;
  }
}
