import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogErrorService } from './log.error.service';
import { LogError, LogErrorSchema } from '../../schemas/log.error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogError.name, schema: LogErrorSchema },
    ]),
  ],
  controllers: [],
  providers: [LogErrorService],
  exports: [LogErrorService],
})
export class LogErrorModule {}
