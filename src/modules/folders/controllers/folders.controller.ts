import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FolderService } from '../services/folders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';

import { CreateFolderDto } from '../dto/createFolder.dto';
import { CreateFolderGuard } from 'src/auth/guard/folder/createFolder.guard';
import { EditFolderGuard } from 'src/auth/guard/folder/editFolder.guard';
import { EditFolderDto } from '../dto/editFolder.dto';
import { DeleteFolderGuard } from 'src/auth/guard/folder/deleteFolder.guard';

@Controller('folder')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(RolesConfig.all)
@Status(StatusConfig.approved)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/get')
  async getFolders(@Req() req) {
    return this.folderService.get(req);
  }

  @UseGuards(CreateFolderGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('create')
  async createFolders(
    @Query('id') id: string,
    @Body() data: CreateFolderDto,
    @Req() req: Request,
  ) {
    return this.folderService.create(id || null, data, req);
  }

  @UseGuards(EditFolderGuard)
  @Post('edit')
  async editFolders(
    @Query('id') id: string,
    @Body() data: EditFolderDto,
    @Req() req: Request,
  ) {
    return this.folderService.edit(id, data, req);
  }

  @UseGuards(DeleteFolderGuard)
  @Post('delete')
  async deleteFolders(@Query('id') id: string) {
    return this.folderService.delete(id);
  }
}
