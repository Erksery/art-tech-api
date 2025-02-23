import { Body, Controller, Post } from '@nestjs/common';

import { User } from 'src/models/user.model';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }
}
