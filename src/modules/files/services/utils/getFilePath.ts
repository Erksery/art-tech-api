import { HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { File } from 'src/models/file.model';

export const getFilePath = async (fileModel: typeof File, fileId: string) => {
  try {
    if (!fileId) {
      throw new HttpException(`Отсутствует id файла`, HttpStatus.NOT_FOUND);
    }
    const file = await fileModel.findOne({ where: { id: fileId } });

    if (!file) {
      throw new HttpException(
        `Файл с id: ${fileId} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    const filePath = join(
      __dirname,
      '..',
      '..',
      process.env.UPLOAD_FOLDER || 'uploads',
      file.name,
    );

    return filePath;
  } catch (err) {
    console.error('Ошибка при получении файла', err);
  }
};
