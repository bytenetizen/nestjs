import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './realization/users.module';
import { MongooModule } from './config/database/mongo.module';
import { EventConfig } from './config/event/event.config';
import { EventsModule } from './realization/events/events.module';
import { AppQueueModule } from './realization/queues/app.queue.module';
import { AppConfigModule } from './config/app/app.config.module';
import { AppThrottlerModule } from './config/app/app.throttler.module';
import { V1Module } from './route/v1/v1.controller';
import { RouterModule } from '@nestjs/core';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { IpRange, IpRangeSchema } from './schemas/ip.range.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IpRange.name, schema: IpRangeSchema }]),
    AppQueueModule,
    MongooModule,
    AppConfigModule,
    AppThrottlerModule,
    EventConfig,
    UsersModule,
    EventsModule,
    V1Module,
    RouterModule.register([
      {
        path: 'v1',
        module: V1Module,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppThrottlerModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
