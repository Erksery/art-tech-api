import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 12)
  login: string;

  @IsString()
  @Length(6, 24)
  password: string;
}

import { Exclude, Expose } from 'class-transformer';

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
