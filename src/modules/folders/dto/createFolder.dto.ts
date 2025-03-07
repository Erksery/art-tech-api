import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty({ message: 'Название папки не может быть пустым' })
  @IsString({ message: 'Название папки должно быть строкой' })
  @MinLength(5, {
    message: 'Название папки должно содержать минимум 5 символов',
  })
  name: string;

  @IsUUID('4', { message: 'Некорректный идентификатор пользователя' })
  creator?: string;
}
