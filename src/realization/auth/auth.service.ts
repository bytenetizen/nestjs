import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TokenService } from './token.service';
import { FrontService } from '../user/front.service';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService: TokenService,
    private readonly frontService: FrontService,
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

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.eventEmitter.emit('user.login', user);
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id);

    return {
      user: this.frontService.extractUserFields(user),
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

  async getRefreshToken(userId: string, refreshTokenOld: string) {
    await this.tokenService.deletedTokens(userId, refreshTokenOld);
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId);
    return {
      accessToken,
      refreshToken,
    };
  }
}
