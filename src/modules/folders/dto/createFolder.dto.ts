import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty({ message: 'Название папки не может быть пустым' })
  @IsString({ message: 'Название папки должно быть строкой' })
  @MinLength(5, {
    message: 'Название папки должно содержать минимум 5 символов',
  })
  name: string;
  folderId?: string;

  @IsOptional()
  @IsString({ message: 'Описание папки должно быть строкой' })
  @MaxLength(100, {
    message: 'Описание папки должно содержать максимум 100 символов',
  })
  description?: string;
}
