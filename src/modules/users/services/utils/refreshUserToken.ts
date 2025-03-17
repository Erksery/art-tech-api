import { Token } from 'src/models/token.model';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { tokensGenerate } from './scripts/tokensGenerate';

export const refreshUserToken = async (
  refreshToken: string,
  userModel: typeof User,
  tokenModel: typeof Token,
  jwtService,
) => {
  try {
    if (!refreshToken) {
      throw new HttpException('Токен не передан', HttpStatus.BAD_REQUEST);
    }
    const tokenInDb = await tokenModel.findOne({
      where: { token: refreshToken },
    });

    if (!tokenInDb) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await userModel.findOne({
      where: { id: tokenInDb.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь с таким именем не найден');
    }
    const { accessToken, refreshToken: newRefreshToken } = tokensGenerate(
      user,
      jwtService,
    );

    await tokenModel.destroy({ where: { token: refreshToken } });
    await tokenModel.create({ userId: user.id, token: refreshToken });

    return { accessToken, newRefreshToken };
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      throw err;
    }
    console.error('Ошибка при получении refresh токена', err);
    throw new HttpException(
      'Ошибка при получении refresh токена',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
