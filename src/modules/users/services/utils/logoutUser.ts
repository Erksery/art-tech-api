import {
  HttpException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common'
import { Token } from 'src/models/token.model'

export const logoutUser = async (
  refreshToken,
  tokenModel: typeof Token,
  res
) => {
  try {
    if (refreshToken) {
      const deleted = await tokenModel.destroy({
        where: { token: refreshToken }
      })
      if (!deleted) {
        throw new UnauthorizedException('Пользователь не авторизован')
      }
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      })
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Выход из аккаунта выполнен успешно' })
    } else {
      throw new UnauthorizedException('Пользователь не авторизован')
    }
  } catch (err) {
    console.error('Ошибка при выходе пользователя', err)
    throw new HttpException(
      'Ошибка при выходе пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
