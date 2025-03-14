import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const tokensGenerate = (user: User, jwtService: JwtService): Tokens => {
  const payload = {
    id: user.id,
    //login: user.login,
    role: user.role,
    status: user.status,
  };

  const accessToken = jwtService.sign(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '30m',
  });

  const refreshToken = jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};
