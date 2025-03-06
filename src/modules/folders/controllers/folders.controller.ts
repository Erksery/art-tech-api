import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from '../services/folders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';

@Controller('folder')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(RolesConfig.all)
@Status(StatusConfig.approved)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get(':id')
  async getFolders(@Param('id') id: string) {
    return this.folderService.get(id);
  }

  @Post('create/:id')
  async createFolders(@Param('id') id: string) {
    return this.folderService.create(id);
  }

  @Post('edit/:id')
  async editFolders(@Param('id') id: string) {
    return this.folderService.edit(id);
  }

  @Post('delete/:id')
  async deleteFolders(@Param('id') id: string) {
    return this.folderService.delete(id);
  }
}
