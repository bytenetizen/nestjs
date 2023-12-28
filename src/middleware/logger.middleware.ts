import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {}
  async use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress;
    if (await this.appService.isUseService(ip)) {
      res.statusCode = HttpStatus.FORBIDDEN;
      res.end('You cannot use this service!');
      return;
    }
    next();
  }
}
