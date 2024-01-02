import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AppCryptoService {
  constructor(private readonly configService: ConfigService) {}
  async createAppCipher(payload: object | string): Promise<any> {
    try {
      const payloadString = JSON.stringify(payload);
      const iv = randomBytes(16);
      const privateKey = this.configService.get<string>(
        'privateCryptoKey',
        'error',
      );
      const privateSalt = this.configService.get<string>(
        'privateCryptoSalt',
        'fgo',
      );
      const key = (await promisify(scrypt)(
        privateKey,
        privateSalt,
        32,
      )) as Buffer;

      const cipher = createCipheriv('aes-256-ctr', key, iv);
      let encryptedText = cipher.update(payloadString, 'utf-8', 'hex');
      encryptedText += cipher.final('hex');
      return iv.toString('hex') + encryptedText;
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  async decryptAppCipher(encrypted: string): Promise<any> {
    try {
      const privateKey = this.configService.get<string>(
        'privateCryptoKey',
        'error',
      );
      const privateSalt = this.configService.get<string>(
        'privateCryptoSalt',
        'fgo',
      );
      const key = (await promisify(scrypt)(
        privateKey,
        privateSalt,
        32,
      )) as Buffer;

      const ivLength = 32; // Длина IV в шестнадцатеричных символах

      const ivString = encrypted.slice(0, ivLength);
      const encryptedTextW = encrypted.slice(ivLength);

      const ivW = Buffer.from(ivString, 'hex');
      const decipherW = createDecipheriv('aes-256-ctr', key, ivW);

      let decryptedTextW = decipherW.update(encryptedTextW, 'hex', 'utf-8');
      decryptedTextW += decipherW.final('utf-8');

      return JSON.parse(decryptedTextW);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
