import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { File } from 'src/models/file.model'

export const pasteFile = async (
  fileModel: typeof File,
  files: string[],
  folderId: string
) => {
  try {
    console.log(folderId, files, typeof files)
    if (!folderId) {
      throw new HttpException(`Отсутствует id папки`, HttpStatus.NOT_FOUND)
    }

    const copiedFiles: File[] = []

    for (const fileId of files) {
      const file = await fileModel.findByPk(fileId)
      if (!file) {
        console.warn(`Файл с id ${fileId} не найден, пропускаем`)
        continue
      }

      const copiedFile = await fileModel.create({
        name: file.name,
        originalFilename: file.originalFilename,
        creator: file.creator,
        mimeType: file.mimeType,
        size: file.size,
        folderId: folderId,
        isDeleted: false
      })

      copiedFiles.push(copiedFile)
    }

    return copiedFiles
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err
    }

    console.error('Ошибка при вставке файлов', err)
    throw new HttpException(
      'Ошибка при вставке файлов',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
