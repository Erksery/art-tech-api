import { IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @Length(3, 12)
  login: string;

  @IsString()
  @Length(6, 24)
  password: string;
}

export class RegisterResponseDto {
  @Expose()
  id: number;

  @Expose()
  login: string;

  @Expose()
  status: string;

  @Expose()
  role: string;

  @Exclude()
  password?: string;

  @Exclude()
  refreshToken?: string;

  @Expose()
  avatar_url?: string;
}
