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
  async createUser(data: any) {
    const saltRounds: number = this.configService.get<number>('saltRounds', 13);

    data.password = await bcrypt.hash(data.password, saltRounds);

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
