import { Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { FilterUsersDto } from '../../dto/get-users.dto';

export const findAllUsers = async (
  userModel: typeof User,
  filters: FilterUsersDto,
) => {
  try {
    const where: any = {};

    if (filters.status) {
      where.status = { [Op.iLike]: `%${filters.status}%` };
    }

    if (filters.search) {
      where.login = { [Op.iLike]: `%${filters.search}%` };
    }

    const limit = filters.limit ?? 10;
    const offset = filters.page ? (filters.page - 1) * limit : 0;

    const sortBy = filters.sortBy || 'login';
    const order = (filters.order || 'asc').toUpperCase();

    const users = await userModel.findAll({
      where,
      order: [[sortBy, order]],
      limit,
      offset,
    });

    return users;
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err;
    }

    console.error('Ошибка при получении пользователей', err);
    throw new HttpException(
      'Ошибка при получении пользователей',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
