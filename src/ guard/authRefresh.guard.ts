import { Injectable, CanActivate } from '@nestjs/common';
import { TokenService } from '../realization/auth/token.service';
import { AuthService } from '../realization/auth/auth.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const data = request.session.get('token');

    if (!data) {
      return false;
    }

    const checkToken = this.tokenService.checkToken(
      data?.refreshToken,
      'refreshTokenSecret',
    );
    if (!checkToken) {
      return false;
    }

    const checkAppToken = await this.authService.checkAppRefreshToken(
      data?.refreshToken,
    );

    if (!!checkAppToken) {
      const user = this.tokenService.decodeToken(
        data?.refreshToken,
        'refreshTokenSecret',
      );
      request.refreshToken = data?.refreshToken;
      request.user = user;
      return true;
    }

    return false;
  }
}
