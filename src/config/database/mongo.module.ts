import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'db.mongo.mongoHost',
          'mongodb://127.0.0.1:27017/errors',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class MongooModule {}
