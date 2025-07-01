import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'

import { Request } from 'express'

import { FilesService } from '../services/files.service'
import { AuthGuard } from 'src/auth/guard/auth.guard'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { CreateFileGuard } from 'src/auth/guard/file/createFile.guard'
import { StatusGuard } from 'src/auth/guard/status.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Status } from 'src/auth/decorators/status.decorator'
import { RolesConfig } from 'src/config/roles.config'
import { StatusConfig } from 'src/config/status.config'
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes'
import { PARAMS_VALUES } from 'src/config/constants.config'

@Controller(SITE_CONTROLLER.UPLOAD)
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(...RolesConfig.all)
@Status(...StatusConfig.approved)
export class UploadController {
  constructor(private filesService: FilesService) {}

  @Post(SITE_ROUTES.UPLOAD)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  async uploadFile(
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Req() req: Request,
    @Res() res
  ) {
    return this.filesService.upload(folderId, req, res)
  }
}
