import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 12)
  login: string;

  @IsString()
  @Length(6, 24)
  password: string;
}
