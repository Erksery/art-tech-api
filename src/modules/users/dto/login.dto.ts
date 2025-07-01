import { Exclude, Expose } from 'class-transformer'
import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  login: string

  @IsString()
  @MinLength(6)
  password: string
}

export class LoginResponseDto {
  @Expose()
  id: number

  @Expose()
  login: string

  @Expose()
  status: string

  @Expose()
  role: string

  @Exclude()
  password?: string

  @Exclude()
  refreshToken?: string

  @Expose()
  avatar_url?: string
}
