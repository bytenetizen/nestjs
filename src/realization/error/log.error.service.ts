import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogError } from '../../schemas/log.error.schema';

@Injectable()
export class LogErrorService {
  constructor(
    @InjectModel(LogError.name) private logErrorModel: Model<LogError>,
  ) {}

  async create(createCatDto) {
    const createdCat = new this.logErrorModel(createCatDto);
    return createdCat.save();
  }
}
