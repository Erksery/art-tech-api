import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';
import { Folder } from 'src/models/folder.model';

export const deleteFolder = async (
  folderModel: typeof Folder,
  folderId: string,
) => {
  try {
    const folder = await folderModel.findByPk(folderId);

    if (!folder) {
      throw new HttpException(
        `Папка с ID ${folderId} не найдена`,
        HttpStatus.NOT_FOUND,
      );
    }
    const subfolders = await folderModel.findAll({
      where: { inFolder: folderId },
    });

    for (const subfolder of subfolders) {
      await deleteFolder(folderModel, subfolder.id);
    }

    await folder.destroy();

    return { message: `Папка ${folderId} успешно удалена` };
  } catch (err) {
    console.error('Ошибка удаления папки', err);
    throw new HttpException(
      'Ошибка при редактировании папки',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
