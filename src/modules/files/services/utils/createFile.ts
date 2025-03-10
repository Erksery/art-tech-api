import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';

export const createFile = async (
  fileModel: typeof File,
  file,
  folderId: string,
  user,
) => {
  try {
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND);
    }
    const createdFile = await fileModel.create({
      name: file.originalName,
      originalFilename: file.originalname,
      creator: user.id,
      mimeType: file.mimetype,
      size: file.size,
      folderId: folderId,
    });

    return createdFile;
  } catch (err) {
    console.log('Ошибка при создании файла', err);
    throw new HttpException(
      'Ошибка при создании файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
