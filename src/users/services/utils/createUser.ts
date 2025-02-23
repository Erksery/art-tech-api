import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { RegisterDto } from 'src/users/dto/register.dto';
import { InferCreationAttributes } from 'sequelize';

export const createUser = async (dto: RegisterDto, userModel: typeof User) => {
  try {
    const existingUser = await userModel.findOne({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким логином уже существует',
      );
    }

    return await userModel.create({
      login: dto.login,
      password: dto.password,
    } as InferCreationAttributes<User>);
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
