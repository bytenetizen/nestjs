import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create.user.dto';
import { UserService } from '../../realization/user.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginUserDto } from '../../dto/user/login.user.dto';
import { AuthService } from '../../realization/auth/auth.service';
import { VerifyEmailDto } from '../../dto/email/verify.email.dto';
@Controller()
export class BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): any {
    // throw new BadRequestException('Validation failed');
    console.log(response);
    return this.userService.createUser(createUserDto, response);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() loginUserDto: LoginUserDto,
    @Req() request: FastifyRequest,
  ): Promise<any> {
    try {
      const { user, accessToken, refreshToken } = await this.authService.login(
        loginUserDto,
      );

      // request.session.set('token', {
      //   accessToken,
      //   refreshToken,
      // });

      return { result: 'success', accessToken, refreshToken };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('verify/:id/:hash')
  async verifyEmail(
    @Param(ValidationPipe) params: VerifyEmailDto,
  ): Promise<any> {
    try {
      console.log(params.id);
      console.log(params.hash);
      return { result: 'verifyEmail' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('send-reset-link')
  async sendResetLink(): Promise<any> {
    try {
      return { result: 'sendResetLink' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/password/reset')
  async passwordReset(): Promise<any> {
    try {
      return { result: 'passwordReset' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('example')
  example(): any {
    try {
      return { result: 'example' };
    } catch (err) {
      // throw new HttpException('ssss', HttpStatus.UNPROCESSABLE_ENTITY);
      // throw new Error(`validation.between_${minYears}_${maxYears}`);
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }
}
