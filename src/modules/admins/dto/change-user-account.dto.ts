import { StatusEnum, StatusType } from './../../../config/constants.config';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeUserAccountParamsDto {
  @IsNotEmpty({ message: 'Отсутствует индификатор пользователя' })
  @IsUUID(4, { message: 'Некорректный индификатор пользователя' })
  userId: string;
}

export class ChangeUserAccountBodyDto {
  @IsNotEmpty({ message: 'Отсутствует статус пользователя' })
  @IsEnum(StatusEnum, { message: 'Недопустимый статус' })
  status: StatusEnum;
}
