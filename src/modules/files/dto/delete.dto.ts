import { IsArray, IsString } from 'class-validator'

export class DeleteDataDto {
  @IsArray()
  @IsString({ each: true })
  filesId: string[]
}
