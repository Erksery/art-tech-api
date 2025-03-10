import { Folder } from 'src/models/folder.model';
import { findAccessFolders } from './scripts/findAccessFolders';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getFolders = async (folderModel: typeof Folder, user) => {
  try {
    const folder = await findAccessFolders(folderModel, user);
    return folder;
  } catch (err) {
    console.error('Ошибка при получении папок', err);
    throw new HttpException(
      'Ошибка при получении папок',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
