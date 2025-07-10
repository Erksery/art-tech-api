import { existsSync, mkdirSync } from 'fs'
import { rename } from 'fs/promises'
import { join } from 'path'

import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import {
  COMPRESSED_FOLDER,
  ORIGINAL_FOLDER,
  TRASH_FOLDER,
  UPLOAD_FOLDER
} from 'src/config/constants.config'
import { File } from 'src/models/file.model'

export const moveToTrash = async (file: File, fileModel: typeof File) => {
  try {
    const uploadDir = join(process.cwd(), UPLOAD_FOLDER)
    const trashDir = join(uploadDir, TRASH_FOLDER)

    if (!existsSync(trashDir)) {
      mkdirSync(trashDir, { recursive: true })
    }

    const fileName = file.name

    const existCopies = await fileModel.count({
      where: {
        name: fileName,
        isDeleted: false
      }
    })

    if (existCopies >= 1) {
      console.log(
        `Файл ${fileName} не перемещён в корзину, так как есть дубликаты`
      )
      return
    }

    if (file.mimeType.startsWith('video/')) {
      const originalFilePath = join(uploadDir, ORIGINAL_FOLDER, fileName)
      if (existsSync(originalFilePath)) {
        await rename(originalFilePath, join(trashDir, fileName))
      }
    } else if (file.mimeType.startsWith('image/')) {
      const originalFilePath = join(uploadDir, ORIGINAL_FOLDER, fileName)
      const compressFilePath = join(
        uploadDir,
        COMPRESSED_FOLDER,
        `${fileName}.webp`
      )
      if (existsSync(originalFilePath)) {
        await rename(originalFilePath, join(trashDir, fileName))
      }
      if (existsSync(compressFilePath)) {
        await rename(compressFilePath, join(trashDir, `${fileName}.webp`))
      }
    } else {
      const filePath = join(uploadDir, COMPRESSED_FOLDER, `${fileName}.zip`)

      if (existsSync(filePath)) {
        await rename(filePath, join(trashDir, `${fileName}.zip`))
      }
    }
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err
    }

    console.error('Ошибка при перемещении файлов в корзину', err)
    throw new HttpException(
      'Ошибка при перемещении файлов в корзину',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
