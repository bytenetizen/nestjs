import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

//TODO pass and login
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('db.redis.redisHost', '127.0.0.1'),
          port: configService.get<number>('db.redis.redisPort', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'appQueue',
      },
      {
        name: 'appEmailQueue',
      },
    ),
  ],
  providers: [],
  exports: [BullModule],
})
export class QueueConfig {}
