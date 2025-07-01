import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { join } from 'path'

import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import archiver from 'archiver'

export const archiveFile = async (direction, name, path) => {
  try {
    const zipPath = join(direction, `${name}.zip`)
    const zipOutput = createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.on('error', err => {
      throw new HttpException(
        `Ошибка при архивации: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    })
    archive.pipe(zipOutput)
    archive.file(path, { name: name })
    await new Promise<void>((resolve, reject) => {
      zipOutput.on('close', () => resolve())
      zipOutput.on('error', err => reject(err))
      archive.finalize()
    })

    await unlink(path)
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err
    }

    throw new HttpException(
      'Ошибка при архивировании файла',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
