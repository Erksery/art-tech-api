import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { File } from 'src/models/file.model';

export const findAllFiles = async (
  fileModel: typeof File,
  folderId: string,
) => {
  try {
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND);
    }
    const files = await fileModel.findAll({ where: { folderId: folderId } });
    return files;
  } catch (err) {
    console.log('Ошибка при получении файлов', err);
    throw new HttpException(
      'Ошибка при получении файлов',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
