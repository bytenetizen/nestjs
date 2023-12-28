import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { IpRange } from './schemas/ip.range.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(IpRange.name) private IpRangeModel: Model<IpRange>,
  ) {}
  getHello(): string {
    return 'Hello World!!!';
  }

  setLogError(data: object): boolean {
    this.eventEmitter.emit('error.registered', data);
    return true;
  }

  getServerPort(): number {
    return this.configService.get<number>('serverPort', 3000);
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
        const ranges = await this.IpRangeModel.find({
          start_ip: { $lte: ipToCheck },
          end_ip: { $gte: ipToCheck },
        });

        if (ranges.length > 0) {
          return true;
        }
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
      return false;
    }

    return false;
  }
}
