import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { UserService } from '../realization/user.service';
// import { Role } from './your-models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const refreshToken = request.refreshToken;
    const user = request.user;

    if (!refreshToken || !user) {
      return true;
    }
    const userObj = await this.userService.getUser(user.id);
    const hasRequiredRole = userObj.userRoles.some((userRole) =>
      requiredRoles.includes(userRole.role.slug),
    );

    return !!hasRequiredRole;
  }
}
