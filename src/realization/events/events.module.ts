import { Module } from '@nestjs/common';
import { ErrorEventHandler } from './error.event.handler';
import { AppQueueService } from '../queues/app.queue.service';
import { AppQueueModule } from '../queues/app.queue.module';

@Module({
  imports: [AppQueueModule],
  providers: [ErrorEventHandler, AppQueueService, AppQueueModule],
})
export class EventsModule {}
