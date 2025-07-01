import { HttpException, HttpStatus } from '@nestjs/common'
import { File } from 'src/models/file.model'

export const editFile = async (
  fileModel: typeof File,
  fileId: string,
  data
) => {
  try {
    const file = await fileModel.findByPk(fileId)

    if (!file) {
      throw new HttpException(
        `Файл с ID ${fileId} не найден`,
        HttpStatus.NOT_FOUND
      )
    }

    await file.update(data.editData)

    return file
  } catch (err) {
    console.log('Ошибка при редактировании файла', err)
    throw new HttpException(
      'Ошибка при редактировании файла',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
