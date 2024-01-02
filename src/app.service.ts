import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs';
// import { InjectModel } from '@nestjs/mongoose';
// import { IpRange } from './schemas/ip.range.schema';
// import { Model } from 'mongoose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2, // @InjectModel(IpRange.name) private IpRangeModel: Model<IpRange>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  setLogError(data: object): boolean {
    this.eventEmitter.emit('error.registered', data);
    return true;
  }

  getServerPort(): number {
    return this.configService.get<number>('serverPort', 3000);
  }

  getCookiesKey(key: string): Buffer[] {
    const keyString: string = this.configService.get<string>(key, '18*yaCo');

    const keyBuffer = Buffer.alloc(32);
    keyBuffer.write(keyString);

    return [keyBuffer];
  }

  getCookiesSecret(): string {
    return this.configService.get<string>(
      'cookiesSecret',
      'averylogphrasebiggerthanthirtytwochars',
    );
  }
  getCookiesSalt(): string {
    return this.configService.get<string>('cookiesSalt', 'mq9hDxBVDbspDR6n');
  }

  async isUseService(ips: string | string[]): Promise<boolean> {
    const isUseBlacklist: boolean = this.configService.get<boolean>(
      'isUseBlacklist',
      false,
    );
    if (!isUseBlacklist) {
      return false;
    }

    const isUseBlacklistBd: boolean = this.configService.get<boolean>(
      'isUseBlacklistBd',
      false,
    );

    const ipToCheck = Array.isArray(ips) ? ips[0] : ips;
    try {
      if (isUseBlacklistBd) {
        const range = await prisma.blocklistIp.findFirst({
          where: {
            start_ip: { lte: ipToCheck },
            end_ip: { gte: ipToCheck },
          },
        });

        if (range) {
          return true;
        }
        //TODO может стоит сделать переключение

        // const ranges = await this.IpRangeModel.find({
        //   start_ip: { $lte: ipToCheck },
        //   end_ip: { $gte: ipToCheck },
        // });

        // if (ranges.length > 0) {
        //   return true;
        // }
      }

      const isUseBlacklistFile = this.configService.get<boolean>(
        'isUseBlacklistFile',
        false,
      );

      if (isUseBlacklistFile) {
        let blacklist = fs.readFileSync('blacklist.json', 'utf8');
        blacklist = JSON.parse(blacklist);
        return !blacklist.includes(ipToCheck);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }

    return false;
  }

  getCookieSettings() {
    const maxAgeInMillis: number = this.configService.get<number>(
      'maxAgeInMillisCookie',
      30240 * 60 * 1000,
    );

    return [
      {
        sessionName: 'session',
        cookieName: 'session',
        key: this.getCookiesKey('keySession'),
        secret: this.getCookiesSecret(),
        salt: this.getCookiesSalt(),
        cookie: {
          // signed:true,
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: maxAgeInMillis,
        },
      },
      {
        sessionName: 'myOtherSession',
        cookieName: 'appSession',
        key: this.getCookiesKey('keyAppSession'),
        secret: this.getCookiesSecret(),
        salt: this.getCookiesSalt(),
        cookie: {
          path: '/',
          // signed:true,
          httpOnly: true,
          secure: true,
          maxAge: maxAgeInMillis,
        },
      },
    ];
  }

  async checkUni({
    targetName,
    property,
    value,
  }: {
    targetName: string;
    property: string;
    value: any;
  }): Promise<any> {
    if (!targetName || !property || value === undefined) {
      throw new Error(
        'Missing required parameters: targetName, property, value',
      );
    }
    try {
      return await prisma[targetName].findUnique({
        select: {
          [property]: true,
        },
        where: {
          [property]: value,
        },
      });
    } catch (error) {
      // Обработка ошибок или проброс исключения
      throw error;
    }
  }

  async isCheckDateBirth(value: string): Promise<boolean | string> {
    const date = DateTime.fromISO(value);

    if (value !== date.toISODate()) {
      return false;
    }
    const { minYears, maxYears } = this.getYears();

    const currentDate = DateTime.now();
    const minDate = currentDate.minus({ years: maxYears });
    const maxDate = currentDate.minus({ years: minYears });

    if (date < minDate || date > maxDate) {
      return false;
    }

    return true;
  }

  getYears(): { minYears: number; maxYears: number } {
    const minYears: number = this.configService.get<number>('minYears', 13);
    const maxYears: number = this.configService.get<number>('maxYears', 100);
    return { minYears, maxYears };
  }
}
