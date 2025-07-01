import { createReadStream, existsSync, mkdirSync } from 'fs'
import { mkdtemp, readdir, rm, unlink } from 'fs/promises'
import { join } from 'path'

import { NotFoundException } from '@nestjs/common'
import {
  COMPRESSED_FOLDER,
  UPLOAD_FOLDER,
  ZIP_FOLDER
} from 'src/config/constants.config'
import unzipper from 'unzipper'

export const unzipFile = async (fileName: string) => {
  try {
    const zipDir = join(process.cwd(), UPLOAD_FOLDER, ZIP_FOLDER)
    if (!existsSync(zipDir)) {
      mkdirSync(zipDir, { recursive: true })
    }

    const filePath = join(
      process.cwd(),
      UPLOAD_FOLDER,
      COMPRESSED_FOLDER,
      `${fileName}.zip`
    )
    if (!existsSync(filePath)) {
      throw new NotFoundException('Архив не найден')
    }
    const extractTo = await mkdtemp(
      join(process.cwd(), UPLOAD_FOLDER, ZIP_FOLDER, `unzipped-${Date.now()}-`)
    )

    await createReadStream(filePath)
      .pipe(unzipper.Extract({ path: extractTo }))
      .promise()

    const files = await readdir(extractTo)

    if (!files || files.length === 0) {
      throw new NotFoundException('Файл в архиве пустой')
    }

    const extractedFilePath = join(extractTo, files[0])

    return { extractedFilePath, extractTo, file: files[0] }
  } catch (err) {
    console.error('Ошибка при разархивировании файла: ', err)
  }
}
