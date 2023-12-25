import { Module } from '@nestjs/common';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

//TODO @nestjs/config 150 / 8
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: minutes(8),
        limit: 150,
      },
    ]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppThrottlerModule {}
