import configuration from './configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: false,
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [],
})
export class AppConfigModule {}
