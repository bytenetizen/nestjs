import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
// import { AppQueueService } from '../queues/app.queue.service';

//TODO что то сделать с payload
@Injectable()
export class UserLoginEvent {
  // constructor(private readonly appQueue: AppQueueService) {}
  @OnEvent('user.login')
  handleErrorRegistrationEvent(payload: { user: any }) {
    // Обработка события, например, отправка уведомления или выполнение других действий
    console.log(payload);
    console.log(`EventHandler has been UserLoginEvent.`);
    // return this.appQueue.addError(payload);
  }
}
