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

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const checkToken = this.tokenService.checkToken(
      token,
      'refreshTokenSecret',
    );

    if (!checkToken) {
      return false;
    }

    const checkAppToken = await this.authService.checkAppRefreshToken(token);
    if (!!checkAppToken) {
      const user = this.tokenService.decodeToken(token, 'refreshTokenSecret');
      request.refreshToken = token;
      request.user = user?.id;
      return true;
    }

    return false;
  }
}
