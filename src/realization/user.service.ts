import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

//TODO 'active','assay','frozen','deleted'
// Pending: Пользователь только что зарегистрировался и еще не прошел проверку.
// Banned: Пользователь был заблокирован за нарушение правил системы.
// Suspended: Пользователь был временно приостановлен за нарушение правил системы.
// Unconfirmed: Пользователь не подтвердил свою учетную запись.
// New: Пользователь только что зарегистрировался.
// Pro: Пользователь имеет платную подписку.
// VIP: Пользователь имеет особый статус или привилегии.
// Admin: Пользователь является администратором системы.
// Guest: Пользователь не имеет учетной записи, но может просматривать и взаимодействовать с некоторыми функциями системы.

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
}
