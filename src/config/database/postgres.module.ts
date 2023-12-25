import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//TODO not use!!!
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.postgres.host', '127.0.0.1'),
        port: configService.get<number>('db.postgres.port', 5432),
        username: configService.get<string>('db.postgres.username', 'postgres'),
        password: configService.get<string>('db.postgres.password', 'postgres'),
        database: configService.get<string>('db.postgres.database', 'valun'),
        entities: ['../entities/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class PostgresModule {}
