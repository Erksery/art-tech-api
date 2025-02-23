import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/files/interfaces/File.interface';

export function createFile(files: File[], newFile: File) {
  try {
    return [...files, newFile];
  } catch (err) {
    console.log('Ошибка при создании файла', err);
    throw new HttpException(
      'Ошибка при создании файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
