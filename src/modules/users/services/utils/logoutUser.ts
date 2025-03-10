import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Token } from 'src/models/token.model';

export const logoutUser = async (refreshToken, tokenModel: typeof Token) => {
  try {
    const deleted = await tokenModel.destroy({
      where: { token: refreshToken },
    });

    if (!deleted) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return { message: 'Выход выполнен успешно' };
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      throw err;
    }
    console.error('Ошибка при выходе пользователя', err);
    throw new HttpException(
      'Ошибка при выходе пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
