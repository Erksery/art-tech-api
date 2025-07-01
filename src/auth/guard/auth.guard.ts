import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Token } from 'src/models/token.model'
import { User } from 'src/models/user.model'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const accessToken = request.cookies?.accessToken
    const authHeader = request.headers['authorization']
    const refreshToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null

    if (!accessToken) {
      throw new UnauthorizedException('Токен авторизации отсутствует')
    }

    try {
      const userToken = await this.jwtService.verifyAsync(accessToken)

      if (userToken) {
        const user = await User.findOne({
          where: { id: userToken.id },
          attributes: { exclude: ['password'] }
        })
        if (user) {
          request.user = user
        }
      }

      return true
    } catch (error) {
      console.warn('Access токен недействителен:', error.message)
      if (refreshToken) {
        return await this.validateRefreshToken(refreshToken, request)
      }

      throw new UnauthorizedException('Сессия истекла, авторизуйтесь заново')
    }
  }

  private async validateRefreshToken(
    refreshToken: string,
    request
  ): Promise<boolean> {
    try {
      const tokenExists = await Token.findOne({
        where: { token: refreshToken }
      })
      if (!tokenExists) {
        throw new ForbiddenException('Refresh токен недействителен')
      }

      const user = await this.jwtService.verifyAsync(refreshToken)
      request.user = user

      return true
    } catch (error) {
      console.error('Ошибка валидации refresh токена:', error)
      throw new UnauthorizedException('Требуется повторная авторизация')
    }
  }
}
