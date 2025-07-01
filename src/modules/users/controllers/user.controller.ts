import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Request, Response } from 'express'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'
import { AuthGuard } from 'src/auth/guard/auth.guard'
import { UserService } from '../services/user.service'
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes'
import { PARAMS_VALUES } from 'src/config/constants.config'

@Controller(SITE_CONTROLLER.AUTH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(SITE_ROUTES.REG)
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    return this.userService.register(dto, res)
  }

  @Post(SITE_ROUTES.LOGIN)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.userService.login(dto, res)
  }

  @Delete(SITE_ROUTES.LOGOUT)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers['authorization']?.split(' ')[1]
    return this.userService.logout(refreshToken, res)
  }
  @Post(SITE_ROUTES.REFRESH)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers['authorization']?.split(' ')[1]
    return this.userService.refresh(refreshToken, res)
  }
  @Get(SITE_ROUTES.PROFILE)
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    return this.userService.getProfile(req)
  }
  @Get(SITE_ROUTES.USER)
  async getUser(@Param(PARAMS_VALUES.USER_ID) userId: string) {
    console.log(userId)
    return this.userService.getUser(userId)
  }
}
