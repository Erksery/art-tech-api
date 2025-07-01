import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common'
import { AdminsService } from '../services/admins.service'
import {
  ChangeUserAccountBodyDto,
  ChangeUserAccountParamsDto
} from '../dto/change-user-account.dto'
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes'

import { AuthGuard } from 'src/auth/guard/auth.guard'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { StatusGuard } from 'src/auth/guard/status.guard'

import { Roles } from 'src/auth/decorators/roles.decorator'
import { Status } from 'src/auth/decorators/status.decorator'

import { StatusConfig } from 'src/config/status.config'
import { RolesConfig } from 'src/config/roles.config'
import { FilterUsersDto } from '../dto/get-users.dto'

@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(...RolesConfig.admin)
@Status(...StatusConfig.approved)
@Controller(SITE_CONTROLLER.ADMIN)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get(SITE_ROUTES.GET_USERS)
  getUsers(@Query() filters: FilterUsersDto) {
    return this.adminsService.findAllUsers(filters)
  }
  @Patch(SITE_ROUTES.CHANGE_USER)
  changeUserAccount(
    @Param() param: ChangeUserAccountParamsDto,
    @Body() body: ChangeUserAccountBodyDto
  ) {
    return this.adminsService.changeUserAccount(param.userId, body.status)
  }
}
