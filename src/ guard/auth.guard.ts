import { Injectable, CanActivate } from '@nestjs/common';
import { TokenService } from '../realization/auth/token.service';
import { AuthService } from '../realization/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
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

    //TODO edit
    const checkToken = this.tokenService.checkToken(
      data?.accessToken,
      'accessTokenSecret',
    );
    console.log('step1 ', checkToken);
    if (!checkToken) {
      return false;
    }

    const checkAppToken = await this.authService.checkAppAccessToken(
      data?.accessToken,
    );
    return !!checkAppToken;
  }
}
