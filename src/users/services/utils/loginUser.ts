import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { LoginDto, LoginResponseDto } from 'src/users/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { tokensGenerate } from './scripts/tokensGenerate';
import { plainToInstance } from 'class-transformer';
import { Token } from 'src/models/tokens.model';
import { Response } from 'express';

export const loginUser = async (
  dto: LoginDto,
  userModel: typeof User,
  tokenModel: typeof Token,
  jwtService,
) => {
  try {
    const user = await userModel.findOne({ where: { login: dto.login } });

    if (!user) {
      throw new UnauthorizedException('Пользователь с таким именем не найден');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    const { accessToken, refreshToken } = tokensGenerate(user, jwtService);

    const existingToken = await tokenModel.findOne({
      where: { userId: user.id },
    });

    if (existingToken) {
      await existingToken.update({ token: refreshToken });
    } else {
      await tokenModel.create({ userId: user.id, token: refreshToken });
    }

    const userResponse = plainToInstance(LoginResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return { user: userResponse, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      throw err;
    }
    console.error('Ошибка при авторизации пользователя', err);
    throw new HttpException(
      'Ошибка при авторизации пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
