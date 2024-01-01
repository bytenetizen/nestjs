import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

const privateKey = fs.readFileSync('private.pem', 'utf8');
const publicKey = fs.readFileSync('public.pem', 'utf8');
const prisma = new PrismaClient();
@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}
  async generateTokens(
    user: any,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    try {
      const payload = user;

      const accessTokenSecret = this.configService.get<string>(
        'accessTokenSecret',
        'wtf',
      );
      const refreshTokenSecret = this.configService.get<string>(
        'refreshTokenSecret',
        'wtf2',
      );

      const accessTokenTime = this.configService.get<number>(
        'accessTokenTime',
        16,
      );

      const refreshTokenTime = this.configService.get<number>(
        'refreshTokenTime',
        30240,
      );

      const accessToken = this.getToken(
        payload,
        accessTokenTime + 'm',
        accessTokenSecret,
      );
      const refreshToken = this.getToken(
        { id: payload.id },
        refreshTokenTime + 'm',
        refreshTokenSecret,
      );
      // const accessToken = this.getTokenRS(payload, accessTokenTime + 'm');
      // const refreshToken = this.getTokenRS(payload, refreshTokenTime + 'm');
      const now = new Date();

      const accessExpiresAt = new Date(
        now.getTime() + accessTokenTime * 60 * 1000,
      ); // 5 minutes in milliseconds

      const refreshExpiresAt = new Date(
        now.getTime() + refreshTokenTime * 60 * 1000,
      );
      const saveToken = await prisma.accessToken.create({
        data: {
          user_id: user.id,
          token: accessToken,
          expires_at: accessExpiresAt,
        },
      });

      await prisma.refreshToken.create({
        data: {
          access_token_id: saveToken.id,
          id: refreshToken,
          expires_at: refreshExpiresAt,
        },
      });

      return { refreshToken, accessToken };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  checkToken(token: string, secretKey: string): boolean {
    const accessTokenSecret = this.configService.get<string>(secretKey, 'wtf');
    try {
      const verified = jwt.verify(token, accessTokenSecret);
      return !!verified;
    } catch (err) {
      return false;
    }
  }

  decodeToken(token: string, secretKey: string): any | null {
    try {
      const accessTokenSecret = this.configService.get<string>(
        secretKey,
        'wtf',
      );
      return jwt.verify(token, accessTokenSecret);
    } catch (error) {
      return null;
    }
  }

  async deletedTokens(userId, refreshTokenOld) {
    const tokenClient = await prisma.refreshToken.delete({
      where: { id: refreshTokenOld },
    });

    await prisma.accessToken.delete({
      where: { id: tokenClient.access_token_id },
    });

    // await prisma.accessToken.deleteMany({
    //   where: {
    //     expires_at: {
    //       lt: new Date(),
    //     },
    //   },
    // });
    // await prisma.refreshToken.deleteMany({
    //   where: {
    //     expires_at: {
    //       lt: new Date(),
    //     },
    //   },
    // });
  }

  private getToken(payload: object, expiresIn: string, secret: string) {
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
  }

  private getTokenRS(payload: object, expiresIn: string) {
    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: expiresIn,
    });
  }
}
