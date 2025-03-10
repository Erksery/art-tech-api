import { Folder } from 'src/models/folder.model';
import { Op } from 'sequelize';

export const findAccessFolders = async (folderModel: typeof Folder, user) => {
  const folders = await folderModel.findAll({
    where: {
      [Op.or]: [{ privacy: 'Public' }, { creator: user.id }],
    },
    raw: true,
  });
  return folders;
};
