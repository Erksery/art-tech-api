import { HttpException, HttpStatus } from '@nestjs/common';
import { Folder } from 'src/models/folder.model';

export const editFolder = async (
  folderModel: typeof Folder,
  folderId: string,
  data,
) => {
  try {
    const folder = await folderModel.findByPk(folderId);

    if (!folder) {
      throw new HttpException(
        `Папка с ID ${folderId} не найдена`,
        HttpStatus.NOT_FOUND,
      );
    }
    await folder.update(data.editData);

    return folder;
  } catch (err) {
    console.log('Ошибка при редактировании папки', err);
    throw new HttpException(
      'Ошибка при редактировании папки',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
