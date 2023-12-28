import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppQueueService } from '../queues/app.queue.service';

//TODO что то сделать с payload
@Injectable()
export class ErrorEventHandler {
  constructor(private readonly appQueue: AppQueueService) {}
  @OnEvent('error.registered')
  handleErrorRegistrationEvent(payload: {
    status: number;
    front: any;
    stack: any;
  }) {
    // Обработка события, например, отправка уведомления или выполнение других действий
    console.log(`EventHandler has been error.registered.`);
    return this.appQueue.addError(payload);
  }
}
