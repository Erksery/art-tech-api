import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { File } from 'src/models/file.model';
import { Folder } from 'src/models/folder.model';
import { LOCATION_VALUER, PRIVACY_VALUES } from 'src/config/constants.config';

export const searchAllFiles = async (
  fileModel: typeof File,
  folderModel: typeof Folder,
  folderId: string,
  searchValue: string,
  location: string,
  req,
) => {
  try {
    //Обработка локального поиска
    if (!location) {
      throw new HttpException(
        `Не указан способ поиска файлов`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (location === LOCATION_VALUER.LOCAL) {
      if (!folderId) {
        throw new HttpException(
          `Отсутствует id папки для локального поиска`,
          HttpStatus.NOT_FOUND,
        );
      }
      const folder = await folderModel.findByPk(folderId);
      if (!folder) {
        throw new HttpException(`Папка не найдена`, HttpStatus.NOT_FOUND);
      }

      const isOwner = folder.creator === req.user.id;
      const isPublic = folder.privacy !== PRIVACY_VALUES.PRIVATE;

      if (!isPublic && !isOwner) {
        throw new HttpException(
          'Недостаточно прав для просмотра этой папки',
          HttpStatus.FORBIDDEN,
        );
      }

      const files = await fileModel.findAll({
        where: {
          folderId,
          originalFilename: { [Op.like]: `%${searchValue}%` },
        },
      });

      return files;
    } else {
      // Получение всех публичных папок
      const accessibleFolders = await folderModel.findAll({
        where: {
          [Op.or]: [{ privacy: 'Public' }, { creator: req.user.id }],
        },
      });
      // Список id публичных папок в виде массива
      const accessibleFolderIds = accessibleFolders.map((f) => f.id);

      const files = await fileModel.findAll({
        where: {
          folderId: { [Op.in]: accessibleFolderIds },
          originalFilename: { [Op.like]: `%${searchValue}%` },
        },
      });
      return files;
    }
  } catch (err) {
    console.log('Ошибка при поиске файлов', err);
    throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
