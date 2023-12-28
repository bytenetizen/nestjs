import { Module } from '@nestjs/common';
import { ErrorEventHandler } from './error.event.handler';
import { AppQueueService } from '../queues/app.queue.service';
import { AppQueueModule } from '../queues/app.queue.module';
import { UserRegisterEvent } from './user.register.event';
import { UserLoginEvent } from './user.login.event';

@Module({
  imports: [AppQueueModule],
  providers: [
    ErrorEventHandler,
    UserRegisterEvent,
    UserLoginEvent,
    AppQueueService,
    AppQueueModule,
  ],
})
export class EventsModule {}
