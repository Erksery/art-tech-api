import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, response, Response } from 'express';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserService } from '../services/user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    return this.userService.register(dto, res);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.userService.login(dto, res);
  }
  @Delete('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    return this.userService.logout(refreshToken, res);
  }
  @Post('refresh')
  @UseGuards(AuthGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    return this.userService.refresh(refreshToken, res);
  }
}
