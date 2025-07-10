import { existsSync, mkdirSync, renameSync } from 'fs'
import { join } from 'path'

import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { Op } from 'sequelize'
import {
  COMPRESSED_FOLDER,
  ORIGINAL_FOLDER,
  TRASH_FOLDER,
  UPLOAD_FOLDER
} from 'src/config/constants.config'
import { File } from 'src/models/file.model'
import { Trash } from 'src/models/trash.model'
import { AuthRequest } from 'src/types/AuthRequest.type'

import { moveToTrash } from './moveToTrash'

export const deleteFile = async (
  fileModel: typeof File,
  trashModel: typeof Trash,
  fileId: string,
  req: AuthRequest
) => {
  try {
    const uploadDir = join(process.cwd(), UPLOAD_FOLDER)
    const trashDir = join(uploadDir, TRASH_FOLDER)

    if (!existsSync(trashDir)) {
      mkdirSync(trashDir, { recursive: true })
    }

    if (!fileId) {
      throw new HttpException(`Отсутствует id файла`, HttpStatus.NOT_FOUND)
    }

    let file: File | null = null

    await fileModel.sequelize?.transaction(async transaction => {
      file = await fileModel.findByPk(fileId, { transaction })

      if (!file) {
        throw new HttpException(
          `Файл с ID ${fileId} не найден`,
          HttpStatus.NOT_FOUND
        )
      }

      await trashModel.create(
        {
          fileId: file.id,
          deletedBy: req.user.id,
          deletedAt: new Date(),
          reason: 'Удален пользователем'
        },
        { transaction }
      )

      await file.update({ isDeleted: true }, { transaction })
    })

    if (file) {
      await moveToTrash(file, fileModel)
    }

    return { message: `Файл ${fileId} успешно удален` }
  } catch (err) {
    console.log('Ошибка при удалении файла', err)
    throw new HttpException(
      'Ошибка при удалении файла',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

export const deleteFiles = async (
  fileModel: typeof File,
  trashModel: typeof Trash,
  filesId: string[],
  req: AuthRequest
) => {
  try {
    if (!filesId || filesId.length === 0) {
      throw new HttpException(`Отсутствует id файлов`, HttpStatus.BAD_REQUEST)
    }

    let files: File[] = []

    await fileModel.sequelize?.transaction(async transaction => {
      files = await fileModel.findAll({
        where: {
          id: {
            [Op.in]: filesId
          }
        },
        transaction
      })

      if (files.length !== filesId.length) {
        throw new HttpException(
          `Некоторые файлы не найдены`,
          HttpStatus.NOT_FOUND
        )
      }

      await trashModel.bulkCreate(
        files.map(file => ({
          fileId: file.id,
          deletedBy: req.user.id,
          deletedAt: new Date(),
          reason: 'Удален пользователем'
        })),
        { transaction }
      )

      await fileModel.update(
        { isDeleted: true },
        { where: { id: { [Op.in]: filesId } }, transaction }
      )
    })

    for (const file of files) {
      try {
        await moveToTrash(file, fileModel)
      } catch (err) {
        console.error(`Ошибка при переносе файла ${file.name}:`, err)
        throw new HttpException(
          `Ошибка при переносе файла ${file.name} в корзину`,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }

    return { message: `Файл(ы) успешно удален(ы)` }
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err
    }
    console.log('Ошибка при удалении файлов', err)
    throw new HttpException(
      'Ошибка при удалении файлов',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
