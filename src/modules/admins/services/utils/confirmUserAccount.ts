import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { User } from 'src/models/user.model'

import {
  STATUS_VALUES,
  StatusType
} from './../../../../config/constants.config'

export const confirmUserAccount = async (
  userModel: typeof User,
  userId: string,
  status: StatusType
) => {
  try {
    const user = await userModel.findByPk(userId)

    if (!user) {
      throw new HttpException(
        `Пользователь с ID ${userId} не найден`,
        HttpStatus.NOT_FOUND
      )
    }

    await user.update({ status: status })

    return user
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err
    }

    console.error('Ошибка при подтверждении аккаунта пользователя', err)
    throw new HttpException(
      'Ошибка при подтверждении аккаунта пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
