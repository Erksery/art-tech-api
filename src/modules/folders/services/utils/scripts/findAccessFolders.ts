import { Folders } from 'src/models/folders.model';
import { Op } from 'sequelize';

export const findAccessFolders = async (folderModel: typeof Folders, user) => {
  const folders = await folderModel.findAll({
    where: {
      [Op.or]: [{ privacy: 'Public' }, { creator: user.id }],
    },
    raw: true,
  });
  return folders;
};
