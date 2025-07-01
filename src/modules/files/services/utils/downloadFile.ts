import { rm } from 'fs/promises'
import { join } from 'path'

import { NotFoundException } from '@nestjs/common'
import { ORIGINAL_FOLDER, UPLOAD_FOLDER } from 'src/config/constants.config'

import { unzipFile } from './unzipFile'

export const downloadFile = async (res, fileName: string, fileType: string) => {
  try {
    if (fileType.startsWith('video/') || fileType.startsWith('image/')) {
      const filePath = join(
        process.cwd(),
        UPLOAD_FOLDER,
        ORIGINAL_FOLDER,
        fileName
      )
      return res.download(filePath, fileName)
    } else {
      const result = await unzipFile(fileName)

      if (!result) {
        throw new NotFoundException('Файл не найден')
      }

      const { extractedFilePath, file, extractTo } = result

      return res.download(extractedFilePath, file, async err => {
        if (err) {
          console.error('Ошибка при скачивании файла:', err)
        }
        await rm(extractTo, { recursive: true, force: true })
      })
    }
  } catch (err) {
    console.error('Ошибка при скачивании файла: ', err)
  }
}
