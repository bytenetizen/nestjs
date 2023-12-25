import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppQueueService {
  constructor(
    @InjectQueue('appQueue') private readonly myQueue: Queue, // @InjectQueue('appEmailQueue') private readonly myQueueEmail: Queue,
  ) {}

  async addError(data: any): Promise<void> {
    this.myQueue.add('processError', data); //{ delay: 3000 }
    // this.myQueueEmail.add('processEmail', data); //{ delay: 3000 }
  }
}
