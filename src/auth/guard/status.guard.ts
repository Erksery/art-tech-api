import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatus =
      this.reflector.get<string[]>('status', context.getHandler()) ??
      this.reflector.get<string[]>('status', context.getClass()) ??
      []

    if (!requiredStatus.length) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.status) {
      throw new ForbiddenException('Статус пользователя не определен')
    }
    if (!requiredStatus.includes(user.status)) {
      throw new ForbiddenException(
        'Доступ запрещен: аккаунт пользователя не подтвержден'
      )
    }

    return true
  }
}
