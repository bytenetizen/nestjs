import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create.user.dto';
import { UserService } from '../../realization/user.service';
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): any {
    throw new BadRequestException('Validation failed');
    return this.userService.createUser(createUserDto);
  }
}
