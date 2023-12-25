import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { BaseController } from './base.controller';
import { UsersModule } from '../../realization/users.module';
import { UserService } from '../../realization/user.service';

@Module({
  controllers: [EntryController, BaseController],
  providers: [UsersModule, UserService],
  imports: [],
})
export class V1Module {}
