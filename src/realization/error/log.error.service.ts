import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogError } from '../../schemas/log.error.schema';
import { IpRange } from '../../schemas/ip.range.schema';

@Injectable()
export class LogErrorService {
  constructor(
    @InjectModel(LogError.name) private logErrorModel: Model<LogError>,
    @InjectModel(IpRange.name) private IpRangeModel: Model<IpRange>,
  ) {}

  async create(createCatDto) {
    // const createdIp = new this.IpRangeModel({
    //   start_ip: '2a01:540:885::',
    //   end_ip: '2a01:540:885:ffff:ffff:ffff:ffff:ffff',
    // });
    // createdIp.save();
    const createdLog = new this.logErrorModel(createCatDto);
    return createdLog.save();
  }
}
