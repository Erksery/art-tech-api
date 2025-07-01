import { JwtService } from '@nestjs/jwt'
import { User } from 'src/models/user.model'

interface Tokens {
  accessToken: string
  refreshToken: string
}

export const tokensGenerate = (user: User, jwtService: JwtService): Tokens => {
  const payload = {
    id: user.id,
    role: user.role,
    status: user.status
  }

  const accessToken = jwtService.sign(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES
  })

  const refreshToken = jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES
  })

  return { accessToken, refreshToken }
}
