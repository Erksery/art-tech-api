import {
  HttpException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common'

export const getUser = async (userModel, userId: string) => {
  try {
    if (!userId) {
      throw new UnauthorizedException('Отсутствует id пользователя')
    }
    const user = await userModel.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] }
    })
    return user
  } catch (err) {
    console.log('Ошибка при получении данных пользователя', err)
    throw new HttpException(
      'Ошибка при получении данных пользователя',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
