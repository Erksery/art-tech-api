import { literal, Op } from 'sequelize'
import { PRIVACY_VALUES } from 'src/config/constants.config'
import { Folder } from 'src/models/folder.model'

const selectCounts = `(
            SELECT COUNT(*)
            FROM folders AS sub
            WHERE sub.inFolder = Folder.id
          )`

export const findAccessFolders = async (
  folderModel: typeof Folder,
  privacy: string | undefined,
  folderId: string | null | undefined,
  user
) => {
  const accessCondition = {
    [Op.or]: [
      { creator: user.id },
      { privacy: PRIVACY_VALUES.PUBLIC },
      { privacy: PRIVACY_VALUES.LINK }
    ]
  }

  const whereCondition: any = {
    [Op.and]: accessCondition
  }

  if (folderId === undefined) {
    whereCondition.inFolder = null
  } else {
    whereCondition.inFolder = folderId
  }

  if (privacy) {
    whereCondition.privacy = privacy
  }

  return await folderModel.findAll({
    where: whereCondition,
    attributes: {
      include: [[literal(selectCounts), 'subFolderCount']]
    },
    raw: true
  })
}
