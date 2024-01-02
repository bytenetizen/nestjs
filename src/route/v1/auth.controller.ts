import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../realization/auth/auth.service';
import { LoginUserDto } from '../../dto/user/login.user.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '../../ guard/auth.guard';
import { AuthRefreshGuard } from '../../ guard/authRefresh.guard';
import { User } from '../../decorators/user/user.decorator';
import { RefreshToken } from '../../decorators/token/refresh.token.decorator';
import { PermissionsGuard } from '../../ guard/permissions.guard';
import { RolesGuard } from '../../ guard/roles.guard';

@Controller('auth')
@UseGuards(RolesGuard, PermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initialization')
  initialization(): any {
    try {
      return { result: 'initialization' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  logout(): any {
    try {
      return { result: 'logout' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('refresh')
  @UseGuards(AuthRefreshGuard)
  async refresh(
    @Req() request: FastifyRequest,
    @User() user: any,
    @RefreshToken() refreshTokenOld: string,
  ): Promise<any> {
    try {
      const { accessToken, refreshToken } =
        await this.authService.getRefreshToken(user, refreshTokenOld);
      // request.session.set('token', {
      //   accessToken,
      //   refreshToken,
      // });
      return { result: 'success', accessToken, refreshToken };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }
  @Post('example')
  // @UseGuards(AuthGuard)
  // @Redirect('https://nestjs.com', 301)
  // @Param('id') id: string,
  // @Param('hash') hash: string,
  async example(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() loginUserDto: LoginUserDto,
    @Req() request: FastifyRequest,
  ): Promise<any> {
    //TODO edit!
    //FastifyRequest
    // const data = request.session.get('data');
    // console.log(data);
    // request.session.set('data', {
    //   accessToken: '123456789',
    //   refreshToken: '987654321',
    // });
    // request.myOtherSession.set('data', 'sssssss');
    // request.myOtherSession.set('data', {
    //   accessToken: '123456789',
    //   refreshToken: '987654321',
    // });
    // const encryptedValue = request.cookies['key2'];
    // const signedValue = fastifyCookie.sign('test12', 'secret');
    // response.setCookie('key1', 'value', {
    //   path: '/',
    //   // domain: 'http://localhost/',
    //   signed: true,
    //   maxAge: 6000,
    //   httpOnly: true,
    //   secure: true,
    // });
    // response.setCookie('key2', signedValue);

    // const unsignedvalue = fastifyCookie.unsign(signedValue, 'secret');

    // console.log(unsignedvalue);
    // console.log(encryptedValue);
    //,
    //     @Res({ passthrough: true }) response: FastifyReply,
    const { user, accessToken, refreshToken } = await this.authService.login(
      loginUserDto,
    );

    request.session.set('token', {
      accessToken,
      refreshToken,
    });

    console.log(user);
    return user;
  }

  @Post('private')
  @UseGuards(AuthGuard)
  async private(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() request: FastifyRequest,
  ): Promise<any> {
    return { 1: 'ready' };
  }

  // @Post('refresh')
  // @UseGuards(AuthRefreshGuard, RolesGuard, PermissionsGuard)
  // @Roles('admin', 'rook')
  // @Permissions('read')
  // async refresh(
  //   @User() user: any,
  //   @RefreshToken() refreshTokenOld: string,
  //   @Res({ passthrough: true }) response: FastifyReply,
  //   @Req() request: FastifyRequest,
  // ) {
  //   try {
  //     const { accessToken, refreshToken } =
  //       await this.authService.getRefreshToken(user.id, refreshTokenOld);
  //     request.session.set('token', {
  //       accessToken,
  //       refreshToken,
  //     });
  //     return { result: 'done' };
  //   } catch (err) {
  //     throw new HttpException(err, HttpStatus.UNAUTHORIZED);
  //   }
  // }
}
