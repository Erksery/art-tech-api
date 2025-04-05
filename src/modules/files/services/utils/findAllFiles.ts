import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';

export const findAllFiles = async (
  fileModel: typeof File,
  folderId: string,
  order?: string,
  filter?: string,
  search?: string,
) => {
  try {
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND);
    }

    const where: any = { folderId };

    if (filter) {
      const [key, value] = filter.split('=');
      if (key && value && key !== 'folderId') {
        where[key] = { [Op.like]: `%${value}%` };
      }
    }

    if (search) {
      const [key, value] = search.split('=');
      if (key === 'search' && value) {
        where.originalFilename = { [Op.like]: `%${value}%` };
      }
    }

    let orderClause: any[] = [];
    if (order) {
      const [key, value] = order.split('=');
      if (key && value && ['ASC', 'DESC'].includes(value.toUpperCase())) {
        orderClause.push([key, value.toUpperCase()]);
      }
    }

    const files = await fileModel.findAll({
      where,
      order: orderClause,
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
