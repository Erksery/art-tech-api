import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';

export const findOneFile = async (fileModel: typeof File, fileId: string) => {
  try {
    if (!fileId) {
      throw new HttpException(`Отсутствует id файла`, HttpStatus.NOT_FOUND);
    }
    const file = await fileModel.findOne({ where: { id: fileId } });
    return file;
  } catch (err) {
    console.log('Ошибка при получении файла', err);
    throw new HttpException(
      'Ошибка при получении файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
