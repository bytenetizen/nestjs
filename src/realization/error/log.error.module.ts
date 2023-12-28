import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogErrorService } from './log.error.service';
import { LogError, LogErrorSchema } from '../../schemas/log.error.schema';
import { IpRange, IpRangeSchema } from '../../schemas/ip.range.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogError.name, schema: LogErrorSchema },
      { name: IpRange.name, schema: IpRangeSchema },
    ]),
  ],
  controllers: [],
  providers: [LogErrorService],
  exports: [LogErrorService],
})
export class LogErrorModule {}
