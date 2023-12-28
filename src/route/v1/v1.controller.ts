import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { BaseController } from './base.controller';
import { UsersModule } from '../../realization/users.module';
import { UserService } from '../../realization/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from '../../realization/auth/auth.service';
import { TokenService } from '../../realization/auth/token.service';

@Module({
  controllers: [EntryController, BaseController, AuthController],
  providers: [UsersModule, UserService, AuthService, TokenService],
  imports: [],
})
export class V1Module {}
