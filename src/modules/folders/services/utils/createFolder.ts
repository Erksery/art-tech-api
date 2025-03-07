import { HttpException, HttpStatus } from '@nestjs/common';
import { PRIVACY_VALUES } from 'src/config/constants.config';

export const createFolder = async (folderModel, id, data, user) => {
  try {
    const folder = await folderModel.create({
      name: data.name,
      creator: user.id,
      inFolder: id || null,
      privacy: id
        ? (await folderModel.findByPk(id)).privacy
        : PRIVACY_VALUES.PRIVATE,
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
