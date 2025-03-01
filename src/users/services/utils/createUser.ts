import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Token } from 'src/models/tokens.model';
import { RegisterDto, RegisterResponseDto } from 'src/users/dto/register.dto';
import { InferCreationAttributes } from 'sequelize';

import { plainToInstance } from 'class-transformer';
import { tokensGenerate } from './scripts/tokensGenerate';

export const createUser = async (
  dto: RegisterDto,
  userModel: typeof User,
  tokenModel: typeof Token,
  jwtService,
) => {
  try {
    const existingUser = await userModel.findOne({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким логином уже существует',
      );
    }

    const newUser = await userModel.create({
      login: dto.login,
      password: dto.password,
    } as InferCreationAttributes<User>);

    const { accessToken, refreshToken } = tokensGenerate(newUser, jwtService);

    await tokenModel.create({ userId: newUser.id, token: refreshToken });

    const userResponse = plainToInstance(RegisterResponseDto, newUser, {
      excludeExtraneousValues: true,
    });

    return { user: userResponse, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err;
    }

    console.error('Ошибка при регистрации нового пользователя', err);
    throw new HttpException(
      'Ошибка при регистрации нового пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
