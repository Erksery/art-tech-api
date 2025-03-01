import { User } from 'src/models/user.model';
import { Token } from 'src/models/tokens.model';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { createUser } from './utils/createUser';
import { loginUser } from './utils/loginUser';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Token) private readonly tokenModel: typeof Token,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    return createUser(dto, this.userModel, this.tokenModel, this.jwtService);
  }

  async login(dto: LoginDto) {
    return loginUser(dto, this.userModel, this.jwtService);
  }
}
