import { HttpException, HttpStatus } from '@nestjs/common';
import { Folders } from 'src/models/folders.model';

export const deleteFolder = async (folderModel: typeof Folders, id) => {
  try {
    const folder = await folderModel.findByPk(id);

    if (!folder) {
      throw new HttpException(
        `Папка с ID ${id} не найдена`,
        HttpStatus.NOT_FOUND,
      );
    }
    await folder.destroy();

    return { message: `Папка ${id} успешно удалена` };
  } catch (err) {
    console.error('Ошибка удаления папки', err);
    throw new HttpException(
      'Ошибка при редактировании папки',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
