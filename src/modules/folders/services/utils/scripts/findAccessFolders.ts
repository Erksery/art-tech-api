import { Op } from 'sequelize'
import { PRIVACY_VALUES } from 'src/config/constants.config'
import { Folder } from 'src/models/folder.model'

export const findAccessFolders = async (folderModel: typeof Folder, user) => {
  const folders = await folderModel.findAll({
    where: {
      [Op.or]: [
        { privacy: PRIVACY_VALUES.PUBLIC },
        { privacy: PRIVACY_VALUES.LINK },
        { creator: user.id }
      ]
    },
    raw: true
  })
  return folders
}
