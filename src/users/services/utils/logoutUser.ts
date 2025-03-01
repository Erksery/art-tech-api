import { HttpException, HttpStatus } from '@nestjs/common';
import { Token } from 'src/models/tokens.model';

export const logoutUser = async (refreshToken, tokenModel: typeof Token) => {
  try {
    const deleted = await tokenModel.destroy({
      where: { token: refreshToken },
    });

    console.log(refreshToken);

    if (!deleted) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { message: 'Выход выполнен успешно' };
  } catch (err) {
    console.error('Ошибка при выходе пользователя', err);
    throw new HttpException(
      'Ошибка при выходе пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
