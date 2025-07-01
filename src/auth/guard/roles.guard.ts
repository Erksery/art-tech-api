import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ??
      this.reflector.get<string[]>('roles', context.getClass()) ??
      []

    if (!requiredRoles.length) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.role) {
      throw new ForbiddenException('Роль пользователя не определена')
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Доступ запрещен: недостаточно прав')
    }

    return true
  }
}
