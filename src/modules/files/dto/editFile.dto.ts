import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

class EditDataDto {
  @IsOptional()
  folderId?: string;

  @IsOptional()
  originalFilename?: string;
}

export class EditFileDto {
  @ValidateNested()
  @Type(() => EditDataDto)
  editData: EditDataDto;
}
