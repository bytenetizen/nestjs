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
import { AuthGuard } from './ guard/auth.guard';
import { TokenService } from './realization/auth/token.service';
import { AuthService } from './realization/auth/auth.service';
import { FrontService } from './realization/user/front.service';
import { AppCryptoService } from './realization/app/app.crypto.service';
import { IsUniqueConstraint } from './rule/validation/is.unique';
import { CheckDateBirthConstraint } from './rule/validation/check.date.birth';

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
  providers: [
    AppService,
    AppThrottlerModule,
    AuthGuard,
    AppCryptoService,
    TokenService,
    AuthService,
    FrontService,
    IsUniqueConstraint,
    CheckDateBirthConstraint,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
