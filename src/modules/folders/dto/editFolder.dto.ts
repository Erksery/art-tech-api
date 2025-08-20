import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  ValidateNested,
  registerDecorator,
  ValidationOptions
} from 'class-validator'
import { PRIVACY_VALUES, SHARING_VALUES } from 'src/config/constants.config'

function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNull',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === null || typeof value === 'string'
        },
        defaultMessage() {
          return 'Значение должно быть строкой или null'
        }
      }
    })
  }
}

export class EditDataDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Название папки не может быть пустым' })
  @IsString({ message: 'Название папки должно быть строкой' })
  @MinLength(5, {
    message: 'Название папки должно содержать минимум 5 символов'
  })
  @MaxLength(20, {
    message: 'Название папки должно содержать максимум 20 символов'
  })
  name?: string

  @IsOptional()
  @IsString({ message: 'Описание папки должно быть строкой' })
  @MaxLength(100, {
    message: 'Описание папки должно содержать максимум 100 символов'
  })
  description?: string

  @IsOptional()
  @IsEnum(PRIVACY_VALUES, { message: 'Недопустимое значение для privacy' })
  privacy?: keyof typeof PRIVACY_VALUES

  @IsOptional()
  @IsEnum(SHARING_VALUES, {
    message: 'Недопустимое значение для sharingOptions'
  })
  sharingOptions?: keyof typeof SHARING_VALUES

  @IsOptional()
  @IsStringOrNull({
    message: 'ID родительской папки должно быть строкой или null'
  })
  inFolder?: string | null
}
/*
export class EditFolderDto {
  @ValidateNested()
  @Type(() => EditDataDto)
  editData: EditDataDto
}
*/
