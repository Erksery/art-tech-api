import { User } from 'src/models/user.model';
import { Token } from 'src/models/token.model';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { createUser } from './utils/createUser';
import { loginUser } from './utils/loginUser';
import { logoutUser } from './utils/logoutUser';
import { refreshUserToken } from './utils/refreshUserToken';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Token) private tokenModel: typeof Token,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const { user, accessToken, refreshToken } = await createUser(
      dto,
      this.userModel,
      this.tokenModel,
      this.jwtService,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ user, accessToken, refreshToken });
  }

  async login(dto: LoginDto, res: Response) {
    const { user, accessToken, refreshToken } = await loginUser(
      dto,
      this.userModel,
      this.tokenModel,
      this.jwtService,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ user, accessToken, refreshToken });
  }

  async logout(refreshToken, res: Response) {
    const response = logoutUser(refreshToken, this.tokenModel);
    res.clearCookie('accessToken');
    return res.json(response);
  }

  async refresh(refreshToken, res: Response) {
    const { accessToken } = await refreshUserToken(
      refreshToken,
      this.userModel,
      this.tokenModel,
      this.jwtService,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ accessToken });
  }
}
