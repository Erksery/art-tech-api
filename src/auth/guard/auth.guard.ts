import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new ForbiddenException('Токен авторизации отсутствует');
    }

    const [accessToken, refreshToken] = this.extractTokens(authHeader);

    if (!accessToken && !refreshToken) {
      throw new ForbiddenException('Отсутствуют оба токена');
    }

    try {
      if (accessToken) {
        const user = await this.jwtService.verifyAsync(accessToken);
        request.user = user;
        return true;
      }

      if (refreshToken) {
        const user = await this.jwtService.verifyAsync(refreshToken);
        request.user = user;
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Токен авторизации недействителен');
    }

    return false;
  }

  private extractTokens(authHeader: string) {
    const tokens = authHeader.split(' ');

    // Проверяем формат: Bearer <accessToken> или Bearer <refreshToken>
    if (tokens.length === 2) {
      return [tokens[1], undefined];
    } else if (tokens.length === 3) {
      return [tokens[1], tokens[2]];
    }

    return [undefined, undefined];
  }
}
