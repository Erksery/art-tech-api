import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    console.log(refreshToken);
    return this.userService.logout(refreshToken);
  }
}
