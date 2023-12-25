import { Module } from '@nestjs/common';
import { AppProcessor } from '../../common/processors/app.processor';
import { QueueConfig } from '../../config/queue/queue.config';
import { LogErrorModule } from '../error/log.error.module';
import { EmailProcessor } from '../../common/processors/email.processor';

@Module({
  imports: [QueueConfig, LogErrorModule],
  providers: [AppProcessor, EmailProcessor],
  exports: [QueueConfig],
})
export class AppQueueModule {}
