import { HttpException, HttpStatus } from '@nestjs/common'
import { Op } from 'sequelize'
import { File } from 'src/models/file.model'

export const deleteFile = async (fileModel: typeof File, fileId: string) => {
  try {
    if (!fileId) {
      throw new HttpException(`Отсутствует id файла`, HttpStatus.NOT_FOUND)
    }

    const file = await fileModel.findByPk(fileId)

    if (!file) {
      throw new HttpException(
        `Файл с ID ${fileId} не найден`,
        HttpStatus.NOT_FOUND
      )
    }
    await file.destroy()

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
  filesId: string[]
) => {
  try {
    console.log(filesId)
    if (!filesId || filesId.length === 0) {
      throw new HttpException(`Отсутствует id файлов`, HttpStatus.BAD_REQUEST)
    }

    await fileModel.destroy({
      where: {
        id: {
          [Op.in]: filesId
        }
      }
    })

    return { message: `Выбранные файлы успешно удалены` }
  } catch (err) {
    console.log('Ошибка при удалении файлов', err)
    throw new HttpException(
      'Ошибка при удалении файлов',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
