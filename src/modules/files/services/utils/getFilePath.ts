import { HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { File } from 'src/models/file.model';

export const getFileContent = async (
  fileModel: typeof File,
  fileName: string,
) => {
  try {
    if (!fileName) {
      throw new HttpException('Отсутствует id файла', HttpStatus.NOT_FOUND);
    }
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      process.env.UPLOAD_FOLDER || 'uploads',
      fileName,
    );

    if (!filePath) {
      throw new HttpException('Картинка не найдена', HttpStatus.NOT_FOUND);
    }

    return filePath;
  } catch (err) {
    console.error('Ошибка при чтении файла:', err);
    throw new HttpException(
      'Ошибка при чтении файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
