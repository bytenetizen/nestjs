import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../decorators/auth/permissions.decorator';
// import { Permission } from './your-models';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    //TODO edit
    console.log('PermissionsGuard');
    console.log(requiredPermissions);
    if (!requiredPermissions) {
      // Если нет указанных разрешений, разрешить доступ
      return true;
    }
    return true;
    // Проверить, есть ли у пользователя необходимые разрешения
    // return user.permissions.some((permission: Permission) => requiredPermissions.includes(permission.slug));
  }
}
