import { User } from 'src/models/user.model';
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
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    return createUser(dto, this.userModel);
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    return loginUser(dto, this.userModel, this.jwtService);
  }
}
