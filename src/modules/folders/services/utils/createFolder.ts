import { HttpException, HttpStatus } from '@nestjs/common';
import { PRIVACY_VALUES } from 'src/config/constants.config';
import { Folder } from 'src/models/folder.model';

export const createFolder = async (
  folderModel: typeof Folder,
  folderId,
  data,
  user,
) => {
  try {
    const folder = await folderModel.create({
      name: data.name,
      creator: user.id,
      inFolder: folderId || null,
      privacy: folderId
        ? ((await folderModel.findByPk(folderId))?.privacy ??
          PRIVACY_VALUES.PRIVATE)
        : PRIVACY_VALUES.PRIVATE,
      description: data.description ? data.description : null,
    });
    return folder;
  } catch (err) {
    if (err.original.code === 'ER_DUP_ENTRY') {
      throw new HttpException(
        `Папка с именем "${data.name}" уже существует`,
        HttpStatus.CONFLICT,
      );
    }

    console.error('Ошибка при создании папки', err);
    throw new HttpException(
      'Ошибка при создании папки',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
