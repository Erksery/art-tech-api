import { HttpException, HttpStatus } from '@nestjs/common';
import { Folder } from 'src/models/folder.model';

export const editFolder = async (folderModel: typeof Folder, id, data) => {
  try {
    const folder = await folderModel.findByPk(id);

    if (!folder) {
      throw new HttpException(
        `Папка с ID ${id} не найдена`,
        HttpStatus.NOT_FOUND,
      );
    }
    await folder.update(data);

    return folder;
  } catch (err) {
    console.log('Ошибка при редактировании папки', err);
    throw new HttpException(
      'Ошибка при редактировании папки',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
