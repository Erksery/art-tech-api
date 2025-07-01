import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderEnum, StatusEnum } from 'src/config/constants.config'

enum SortByEnum {
  CREATED_AT = 'createdAt',
  LOGIN = 'login',
  STATUS = 'status',
  ROLE = 'role'
}

export class FilterUsersDto {
  @IsOptional()
  @IsEnum(OrderEnum, { message: 'Недопустимое значение порядка' })
  order: OrderEnum

  @IsOptional()
  @IsEnum(StatusEnum, { message: 'Недопустимый статус' })
  status?: StatusEnum

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsEnum(SortByEnum, { message: 'Недопустимое поле сортировки' })
  sortBy: SortByEnum
}
