import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/models/tokens.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException(
        'Токен авторизации отсутствует или некорректен',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = await this.jwtService.verifyAsync(token);
      const tokenExists = await Token.findOne({ where: { token: token } });
      if (!tokenExists) {
        throw new ForbiddenException(
          'Токен не найден в базе, авторизуйтесь заново',
        );
      }
      request.user = user;
      request.token = token;
      return true;
    } catch (error) {
      console.error('Ошибка валидации токена:', error);
      throw new ForbiddenException('Токен авторизации недействителен');
    }
  }
}
