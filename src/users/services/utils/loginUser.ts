import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { LoginDto } from 'src/users/dto/login.dto';
import * as bcrypt from 'bcryptjs';

export const loginUser = async (
  dto: LoginDto,
  userModel: typeof User,
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
    const token = jwtService.sign({
      id: user.id,
      login: user.login,
      role: user.role,
      status: user.status,
    });
    return { token };
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
