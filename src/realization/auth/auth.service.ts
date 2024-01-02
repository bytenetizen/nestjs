import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TokenService } from './token.service';
import { FrontService } from '../user/front.service';
import { AppCryptoService } from '../app/app.crypto.service';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService: TokenService,
    private readonly frontService: FrontService,
    private readonly appCryptoService: AppCryptoService,
  ) {}
  async login(data: { contact: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: data.contact } },
          { phone: { equals: data.contact } },
        ],
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    console.log(user);
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.eventEmitter.emit('user.login', user);

    const frontUser: { id: string } =
      this.frontService.extractUserTokenFields(user);
    const payload: { id: any } = {
      id: await this.appCryptoService.createAppCipher(frontUser),
    };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(frontUser, payload);
    return {
      user: frontUser,
      accessToken,
      refreshToken,
    };
  }

  async checkAppAccessToken(token: string): Promise<boolean> {
    const tokenObj = await prisma.accessToken.findUnique({
      where: {
        token: token,
        revoked: true,
        expires_at: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    return !!tokenObj;
  }

  async checkAppRefreshToken(token: string): Promise<boolean> {
    const tokenObj = await prisma.refreshToken.findUnique({
      where: {
        id: token,
        revoked: true,
        expires_at: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    return !!tokenObj;
  }

  async getRefreshToken(user: string, refreshTokenOld: string) {
    console.log(user);
    const userDecode = await this.appCryptoService.decryptAppCipher(user);

    await this.tokenService.deletedTokens(userDecode.id, refreshTokenOld);
    const payload: { id: any } = {
      id: await this.appCryptoService.createAppCipher(userDecode),
    };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userDecode, payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
