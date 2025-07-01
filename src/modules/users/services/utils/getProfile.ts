import {
  HttpException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common'

export const getProfile = async (userModel, userId) => {
  try {
    if (!userId) {
      throw new UnauthorizedException('Отсутствует id пользователя')
    }
    const profile = await userModel.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] }
    })
    return profile
  } catch (err) {
    console.error('Ошибка при получении данных пользователя')
    throw new HttpException(
      'Ошибка при получении данных пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
