import { IsArray, IsUUID } from 'class-validator';

export class PasteFileDto {
  @IsArray()
  @IsUUID('4', { each: true })
  files: string[];
}
