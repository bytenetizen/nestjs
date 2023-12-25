import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  getHello(): string {
    return 'Hello World!!!';
  }

  setLogError(data: object): boolean {
    this.eventEmitter.emit('error.registered', data);
    return true;
  }

  getServerPort(): number {
    return this.configService.get<number>('serverPort', 3000);
  }
}
