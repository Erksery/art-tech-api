import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';

export const handleFileUpload = async (
  fileModel: typeof File,
  file,
  folderId: string,
  fileName: string,
  originalName: string,
  user,
) => {
  try {
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND);
    }

    if (!file) {
      throw new HttpException('Файл отсутствует', HttpStatus.BAD_REQUEST);
    }
    const createdFile = await fileModel.create({
      name: fileName,
      originalFilename: originalName,
      creator: user.id,
      mimeType: file.mimetype,
      size: file.size,
      folderId: folderId,
    });

    return createdFile;
  } catch (err) {
    console.error('Ошибка при создании файла', err);

    throw new HttpException(
      'Ошибка при создании файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
