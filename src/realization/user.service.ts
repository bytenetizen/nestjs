import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}
  async createUser(data: any, response: any) {
    const saltRounds: number = this.configService.get<number>('saltRounds', 13);

    data.password = await bcrypt.hash(data.password, saltRounds);
    const userFingerprintCreateArray = [];

    if (data.fingerprint) {
      userFingerprintCreateArray.push({
        fingerprint: data.fingerprint,
        type_fp: 2,
      });
    }

    // if (data.fingerprintBack) {
    //   userFingerprintCreateArray.push({
    //     fingerprint: data.fingerprintBack,
    //     type_fp: 1,
    //   });
    // }

    if (userFingerprintCreateArray.length > 0) {
      data.userFingerprint = {
        create: userFingerprintCreateArray,
      };
    }
    delete data.fingerprint;
    delete data.fingerprintBack;

    const user = prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        lastname: true,
        gender: true,
      },
    });

    this.eventEmitter.emit('user.registered', user);
    return user;
  }

  async getUser(userId: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
