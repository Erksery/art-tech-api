import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';

export const findAllFiles = async (
  fileModel: typeof File,
  folderId: string,
  order?: string,
  filter?: string,
) => {
  try {
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND);
    }

    let filters: any = {};
    let orders: any = {};

    if (filter) {
      const [key, value] = filter.split('=');
      if (key && value && key !== 'folderId') {
        filters[key] = { [Op.like]: `%${value}%` };
      }
    }

    if (order) {
      const [key, value] = order.split('=');
      if (key && value && ['ASC', 'DESC'].includes(value.toUpperCase())) {
        orders = [[key, value.toUpperCase()]];
      }
    }

    const files = await fileModel.findAll({
      where: { folderId: folderId, ...filters },
      order: orders,
    });
    return files;
  } catch (err) {
    console.log('Ошибка при получении файлов', err);
    throw new HttpException(
      'Ошибка при получении файлов',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
