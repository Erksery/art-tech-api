import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FolderService } from '../services/folders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { DeleteFolderGuard } from 'src/auth/guard/folder/deleteFolder.guard';
import { CreateFolderGuard } from 'src/auth/guard/folder/createFolder.guard';
import { EditFolderGuard } from 'src/auth/guard/folder/editFolder.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';
import { RolesConfig } from 'src/config/roles.config';
import { CreateFolderDto } from '../dto/createFolder.dto';
import { EditFolderDto } from '../dto/editFolder.dto';
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes';
import { PARAMS_VALUES } from 'src/config/constants.config';

@Controller(SITE_CONTROLLER.FOLDER)
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles()
@Status(...StatusConfig.approved)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get(SITE_ROUTES.GET)
  async findAll(@Req() req: Request) {
    return this.folderService.get(req);
  }

  @Post(SITE_ROUTES.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFolderGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: CreateFolderDto, @Req() req: Request) {
    return this.folderService.create(data.folderId || null, data, req);
  }

  @Patch(SITE_ROUTES.EDIT)
  @HttpCode(HttpStatus.OK)
  @UseGuards(EditFolderGuard)
  async edit(
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Body() data: EditFolderDto,
  ) {
    return this.folderService.edit(folderId, data);
  }

  @Delete(SITE_ROUTES.DELETE)
  @HttpCode(HttpStatus.OK)
  @UseGuards(DeleteFolderGuard)
  async delete(@Param(PARAMS_VALUES.FOLDER_ID) folderId: string) {
    return this.folderService.delete(folderId);
  }
}
