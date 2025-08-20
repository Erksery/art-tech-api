import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { QueryTypes } from 'sequelize'
import { Folder } from 'src/models/folder.model'

const recursiveFindSubFolders = `WITH RECURSIVE subfolders AS (
    SELECT id
    FROM Folders
    WHERE inFolder = :folderId
    UNION ALL
    SELECT f.id
    FROM Folders f
    INNER JOIN subfolders s ON f.inFolder = s.id
  )
  SELECT id FROM subfolders`

export const editFolder = async (
  folderModel: typeof Folder,
  folderId: string,
  data
) => {
  try {
    const folder = await folderModel.findByPk(folderId)

    const sequelize = folderModel.sequelize!
    const results = await sequelize.query(recursiveFindSubFolders, {
      replacements: { folderId },
      type: QueryTypes.SELECT
    })

    const allSubfolderIds = (results as { id: string }[]).map(r => r.id)

    if (!folder) {
      throw new HttpException(
        `Папка с ID ${folderId} не найдена`,
        HttpStatus.NOT_FOUND
      )
    }

    if (folderId === data.inFolder) {
      throw new HttpException(
        `Нельзя вложить папку саму в себя`,
        HttpStatus.BAD_REQUEST
      )
    }

    if (allSubfolderIds.includes(data.inFolder)) {
      throw new HttpException(
        `Нельзя вложить папку в свою вложенную подпапку`,
        HttpStatus.BAD_REQUEST
      )
    }
    await folder.update(data)

    return folder
  } catch (err) {
    if (err instanceof HttpException) {
      throw err
    }
    console.log('Ошибка при редактировании папки', err)
    throw new HttpException(
      'Ошибка при редактировании папки',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
