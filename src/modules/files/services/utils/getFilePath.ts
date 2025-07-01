import { join } from 'path'

import { HttpException, HttpStatus } from '@nestjs/common'
import { ORIGINAL_FOLDER, UPLOAD_FOLDER } from 'src/config/constants.config'
import { File } from 'src/models/file.model'

export const getFileContent = async (
  fileModel: typeof File,
  fileName: string
) => {
  try {
    if (!fileName) {
      throw new HttpException('Отсутствует id файла', HttpStatus.NOT_FOUND)
    }
    const filePath = join(
      process.cwd(),
      UPLOAD_FOLDER,
      ORIGINAL_FOLDER,
      fileName
    )

    if (!filePath) {
      throw new HttpException('Картинка не найдена', HttpStatus.NOT_FOUND)
    }

    return filePath
  } catch (err) {
    console.error('Ошибка при чтении файла:', err)
    throw new HttpException(
      'Ошибка при чтении файла',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
